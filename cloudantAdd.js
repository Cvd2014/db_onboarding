require('dotenv').load();

var Cloudant = require('cloudant');
var request = require('request')

var username = process.env.cloudant_username;
var password = process.env.cloudant_password;
var api=process.env.api_key;
//cloudant connection
var cloudant = Cloudant({account:username, password:password});
cloudant.db.create('ciaran');
var ciaranCloudant = cloudant.db.use('ciaran')


var startDate=new Date(2002,01,01);

var endDate=new Date(2016,31,01);


function fillDB(){
  var  nextDate= startDate;
  //console.log(nextDate)
 
 dateISO=nextDate.toISOString().split("T")[0];
  var searchUrl="http://api.fixer.io/"+dateISO; 
  //console.log(searchUrl);

  request(searchUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body)
        var obj = JSON.parse(body)
        var id=obj.date

        ciaranCloudant.insert({ _id: id, obj}, function(err, body, header ){
          if (err) {
           return console.log('[ciaran.insert] ', err.message);
          }

          //console.log('You have inserted the record for '+ id);

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
 }



function queryDB(){
 ciaranCloudant.list({include_docs:true}, function(err, data){
    var rows = data.rows;
    var count = 0;
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
    
      count ++;  
    }
    console.log(count+" entries in DB");
  })
}





//queryDB();
//fillDB();


function DoSomething(){
 ciaranCloudant.list(function(err, data){
  if (data.length==0){
    fillDB();
  }else{
    queryDB();
  }

 })
}




DoSomething();
