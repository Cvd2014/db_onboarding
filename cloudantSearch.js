require('dotenv').load();

var Cloudant = require('cloudant');
var request = require('request')

var username = process.env.cloudant_username;
var password = process.env.cloudant_password;


var cloudant = Cloudant({account:username, password:password});
var ciaran = cloudant.db.use('ciaran');


ciaran.get('Guinness', function(err,body){
	if(!err){
		console.log(body);
	}else{
		console.log(err);
	}
})
