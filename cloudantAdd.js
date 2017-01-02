require('dotenv').load();

var Cloudant = require('cloudant');
var request = require('request')

var username = process.env.cloudant_username;
var password = process.env.cloudant_password;
var api=process.env.api_key;

var cloudant = Cloudant({account:username, password:password});
var ciaran = cloudant.db.use('ciaran')

var Indexes={name:"Beer Names", type:"json", index:{fields:["name","_id"]} }



var beerName="Budwesier";

var searchUrl="https://api.brewerydb.com/v2/search?q="+beerName+"&type=beer&key="+api+"&format=json"; 
//console.log(searchUrl)


request(searchUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  //console.log(body)
  var obj = JSON.parse(body)
  var data=obj.data;
  

  ciaran.insert(obj, function(err, body, header, cb ){
      if (err) {
        return console.log('[ciaran.insert] ', err.message);
      }

      console.log('You have inserted the document.');
       })
  };

  ciaran.index(Indexes, function(err, result){
  if (err){
    console.log (err);
  }
    
})

  
})


