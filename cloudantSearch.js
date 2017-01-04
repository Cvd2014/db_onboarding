require('dotenv').load();

var Cloudant = require('cloudant');
var request = require('request');


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

ciaran.list({include_docs:true}, function(err, data){
	var rows = data.rows;
	var count = 1;
	var dates=[];
	var usrates=[];
	var gbprates=[];

	for (row in rows){
		
		var date = rows[row].doc.obj.date;
		var usrate= rows[row].doc.obj.rates.USD;
		var gbprate= rows[row].doc.obj.rates.GBP;
		//console.log (currency);
		//console.log(dates+ " : "+currency_rates);
		dates[row]=date;
		usrates[row]=usrate;
		gbprates[row]=gbprate;
		//console.log(rates)

		count ++; 
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

	 var data=[dataGBP,dataUS];

	 

	var graphOptions={
		filename:"Euro Rate Performance 2000 - 2016",
		fileopt:"overwrite"
	}
	plotly.plot(data, graphOptions, function(err, msg){
		console.log(msg);
	})
})


