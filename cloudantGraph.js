require('dotenv').load();

var Cloudant = require('cloudant');
var request = require('request');
var now=require("performance-now");


var username = process.env.cloudant_username;
var password = process.env.cloudant_password;

var plotly_username = process.env.plotly_username;
var plotly_api_key = process.env.plotly_api_key;

var cloudant = Cloudant({account:username, password:password});
var ciaran = cloudant.db.use('ciaran');
var currency ="USD";
var currency_search="rows[row].doc.obj.rates."+currency
//console.log(currency_search);
  
var plotly =require('plotly')(plotly_username, plotly_api_key);


var display=function(data){
  var iframe = document.createElement("iframe");
  document.getElementById("cloudantDiv").append(graph)
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


getGraph(display)




/**/