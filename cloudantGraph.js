require('dotenv').load();

var Cloudant = require('cloudant');
var request = require('request');
var now=require("performance-now");


var username = process.env.cloudant_username;
var password = process.env.cloudant_password;

var plotly_username = process.env.plotly_username;
var plotly_api_key = process.env.plotly_api_key;

var cloudant = Cloudant({account:username, password:password});
var ciaran = cloudant.db.use('currencies');
var currency ="USD";
var currency_search="rows[row].doc.obj.rates."+currency
//console.log(currency_search);
  
var plotly =require('plotly')(plotly_username, plotly_api_key);


var display=function(data){
  var iframe = document.createElement("iframe");
  //document.getElementById("cloudantDiv").append(graph)
}


function getGraph(callback){
  ciaran.list({include_docs:true}, function(err, data){
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
	
	var US={
		x:dates,
		y:usrates,
		type:"scatter",
		name:"US Rates"
	};
	 var GBP={
	 	x:dates,
	 	y:gbprates,
	 	type:"scatter",
	 	name:"GBP Rates"
	 };
	 var CAD={
	 	x:dates,
	 	y:cadrates,
	 	type:"scatter",
	 	name:"CAD Rates"
	 };

	 var AUD={
	 	x:dates,
	 	y:audrates,
	 	type:"scatter",
	 	name:"AUD Rates"
	 };

	 var data=[GBP,US, CAD, AUD];

	 

	var graphOptions={
		filename:"Euro Rate Performance 2000 - 2016 NOSQL",
		fileopt:"overwrite"
		
	}
	plotly.plot(data, graphOptions, function(err, msg){
		var link_name=msg.url;	
		console.log(link_name);
	
		
		//callback(graph)
	})
  })
};


getGraph(display)




/**/