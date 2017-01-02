require('dotenv').load();

var pg = require('pg');
var request = require('request')

var api=process.env.api_key;

var PG = process.env.ELEPHANTSQL_URL || "postgres://postgres:5432@localhost/postgres"


var client = new pg.Client(PG);

var beerName="Guinness";

var searchUrl="https://api.brewerydb.com/v2/search?q="+beerName+"&type=beer&key="+api+"&format=json"; 

client.connect();
client.query("CREATE SCHEMA IF NOT EXISTS beers");
request(searchUrl, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		
		client.query("CREATE TABLE IF NOT EXISTS beers.beers(data json)");
		client.query("INSERT INTO beers.beers VALUES(response)");
		console.log('You have inserted the document.');
	}
});