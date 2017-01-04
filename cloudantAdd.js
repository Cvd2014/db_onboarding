require('dotenv').load();

var Cloudant = require('cloudant');
var request = require('request')

var username = process.env.cloudant_username;
var password = process.env.cloudant_password;
var api=process.env.api_key;

var cloudant = Cloudant({account:username, password:password});
var ciaran = cloudant.db.use('ciaran')





var Currency="USD";
var startDate=new Date(2000,02,01);

var endDate=new Date(2016,12,31);
var nextDate= startDate;



while (nextDate < endDate){
  
    nextDate.setDate(nextDate.getDate()+1);
    dateISO=nextDate.toISOString().split("T")[0];
    var searchUrl="http://api.fixer.io/"+dateISO; 
    //console.log(searchUrl)


    request(searchUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body)
        var obj = JSON.parse(body)
        var id=obj.date

        ciaran.insert({ _id: id, obj}, function(err, body, header ){
          if (err) {
           return console.log('[ciaran.insert] ', err.message);
          }

          console.log('You have inserted the record for '+ id);
          
        })
  
      }; 
    });

}//close while

/**/
