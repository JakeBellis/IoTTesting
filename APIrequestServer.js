//simple server to upload data to database on post

const { Client } = require('pg');
const http = require('http');
const async = require('async');
var httpPort = 4018;

const client = new Client({
  user: 'bellisjr',
  host: 'localhost',
  database: 'testdb',
  password: 'Rose-hulman1',
  port: 5432  //port for the database
})
client.connect();

http.createServer(function(req, response){
  var headers = req.headers;
  var reqURL = req.url;
  var reqParams = url.parse(reqURL, true);
  var reqParams = reqParams.query;
  console.log(reqParams);
  //var urlParams = url.parse(reqURL, true);
  //var Data = QueryStringToJSON(reqParams);
  var queryData = reqParams;
  async.series([function(callback){
    getData(queryData, callback);
  }], function(err, result){
      if(err){
        console.log("error!!!!");
        throw new Error(err);
      };
      response.writeHead(200,
               {'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'});
      if(result == true){
        response.write('{"result": "true"}');
      }
      else{
        response.write('{"result": "false"}');
      }
      response.end();
  });

}).listen(httpPort);
console.log('Listening on localhost, port: ' + httpPort);

function getData(queryData,callback){
    console.log('insert called');
  sqlString = 'SELECT * FROM readings WHERE $1 AND * ORDER BY time DESC LIMIT 100';
  const values = [queryData.deviceid];
  client.query(sqlString, values, (err,res) => {
    if(err){
      console.log(err.stack);
      callback(null,false);
    }
    else{
      console.log(res.rows[0]) //returns the data
      callback(null,true);
    }
  });

}

function QueryStringToJSON(queryString) {
    var pairs;
    if(queryString.charAt(0) === '?'){
      pairs = queryString.slice(1).split('&');
    }
    else{
      pairs = queryString.split('&');
    }

    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}