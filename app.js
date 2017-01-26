/**************************************************************************************************
 * 
 * IBM Bluemix app with Cloudant service using Node.js
 * Developed by : Tinniam V Ganesh                                               
 * Date:15 Aug 2014
 * 
 */

// Obtain the pouchdb interface from VCAP_SERVICES
var cloudant = require('cloudant');
var http = require('http');
if (process.env.VCAP_SERVICES) {
	  // Running on Bluemix. Parse the process.env for the port and host that we've been assigned.
	  var env = JSON.parse(process.env.VCAP_SERVICES);
	  var host = process.env.VCAP_APP_HOST; 
	  var port = process.env.VCAP_APP_PORT;
	  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    
	  // Also parse out Cloudant settings.
	  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
}

//Insert records into the books DB
 var insert_records = function(req, res) {
 var startDate=new Date(2002,01,01);
 var endDate=new Date(2016,31,01);
	//Parse the process.env for the port and host that we've been assigned
	if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST; 
		  var port = process.env.VCAP_APP_PORT;

		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    
		  // Also parse Cloudant settings.
		  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
	}
	
	var db = new cloudant('rates'),
	 remote =cloudant.url + '/books';
	opts = {
	  continuous: true
	  };
     // Replicate the DB to remote
	console.log(remote);
	db.replicate.to(remote, opts);
	db.replicate.from(remote, opts);
	 var  nextDate= startDate;
  //console.log(nextDate)
 
 dateISO=nextDate.toISOString().split("T")[0];
  var searchUrl="http://api.fixer.io/"+dateISO; 
  console.log(searchUrl);

  request(searchUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body)
        var obj = JSON.parse(body)
        var id=obj.date

        rates.insert({ _id: id, obj}, function(err, body, header ){
          if (err) {
           return console.log('[ciaran.insert] ', err.message);
          }

          console.log('You have inserted the record for '+ id);

        })
  
      }; 

    });



  setTimeout(function(){
    nextDate.setDate(nextDate.getDate()+1);
    if (nextDate < endDate){
      fillDB();
      //console.log(nextDate);
    }

  }, 110)
	
	 res.writeHead(200, {'Content-Type': 'text/plain'});
	 res.write("3 documents is inserted");
	 res.end();
}; // End insert_records





//List Records from the books DB
var list_records = function(req, res) {
	
	rates.list({include_docs:true}, function(err, data){
	var rows = data.rows;
	var count = 1;
	var dates = [];
	var usrates =[];
	var gbprates=[];
	var cadrates=[];
	var audrates=[];

	for (row in rows){
		var information=rows[row].doc.obj;
		var rates=rows[row].doc.obj.rates;
		var date = information.date;
		//console.log(date)
		dates[row]=date;
		usrates[row]=rates.USD;
		gbprates[row]=rates.GBP;
		cadrates[row]=rates.CAD;
		audrates[row]=rates.AUD;
		
		// count ++; 
	}
	
	var dataUS={
		x:dates,
		y:usrates,
		type:"scatter",
		name:"US Rates"
	};
	 var dataGBP={
	 	x:dates,
	 	y:gbprates,
	 	type:"scatter",
	 	name:"GBP Rates"
	 };
	 var dataCAD={
	 	x:dates,
	 	y:cadrates,
	 	type:"scatter",
	 	name:"CAD Rates"
	 };

	 var dataAUD={
	 	x:dates,
	 	y:audrates,
	 	type:"scatter",
	 	name:"AUD Rates"
	 };

	 var data=[dataGBP,dataUS, dataCAD, dataAUD];

	 

	var graphOptions={
		filename:"Euro Rate Performance 2000 - 2016 NOSQL",
		fileopt:"overwrite"
		
	}
	plotly.plot(data, graphOptions, function(err, msg){
		var link_name=msg.url;	
		console.log(link_name);
		var iframe="<iframe width='900' height='800' frameborder='0' scrolling='no' src='"+link_name+".embed'></iframe>" 
		
		var graph=document.createElement("iframe");
		graph.setAttribute("src", link);
		graph.style.width="640px";
		graph.style.height="480px";
		
		callback(graph)
	})
  })
   
  };


var port = (process.env.VCAP_APP_PORT || 1337);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0');

//Create a Webserver and wait for REST API CRUD calls
require('http').createServer(function(req, res) {	  
	//Set up the DB connection
	 if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse for  the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST; 
		  var port = process.env.VCAP_APP_PORT;

		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    

		  // Also parse out Cloudant settings.
		  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
	 }
	
	 var db = new pouchdb('books'),
  	    remote =cloudant.url + '/books';	  
	    opts = {
	      continuous: true
	    };	   
	    console.log(remote);
		db.replicate.to(remote, opts);
		db.replicate.from(remote, opts);			
		console.log("Reached3");
		
	 // Perform CRUD operations through REST APIs
		
	  // Insert document
	  if(req.method == 'POST') {
	             insert_records(req,res);           
	  }
	  // List documents
	  else if(req.method == 'GET') {   
	          list_records(req,res);	          
	   }
	   // Update a document
	   else if(req.method == 'PUT') {
	          update_records(req,res);
	    }
	    // Delete a document
	     else if(req.method == 'DELETE') {
	          delete_record(req,res);
	    }      
  
}).listen(port, host);
console.log("Connected to port =" + port + " host =  " + host);