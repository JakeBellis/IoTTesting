//simple server to upload data to database on post

const { Client } = require('pg');
const http = require('http');
const async = require('async');
var httpPort = 4040;

const client = new Client({
  user: 'xxxxxx',
  host: 'xxxxxxx',
  database: 'xxxxxx',
  password: 'xxxxxxx',
  port: 5432  //port for the database
})
client.connect();

http.createServer(function(req, response){
  var headers = req.headers;
  var reqURL = req.url;
  var reqParams = req.body;
  console.log(reqParams);
  //var urlParams = url.parse(reqURL, true);
  var Data = QueryStringToJSON(reqParams);
  console.log(Data);
  var sensorData = Data;
  async.series([function(callback){
    insertData(sensorData, callback);
  }], function(err, result){
      if(err){
        console.log("error!!!!")
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

function insertData(sensorData,callback){
  sqlString = 'INSERT INTO readings(time,deviceid,temperature,humidity) VALUES($1, $2, $3, $4) RETURNING *';
  const values = [sensorData.time, sensorData.id, sensorData.temp, sensorData.humid];
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
