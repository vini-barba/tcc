'use strict';
var mysql = require('mysql');
let conf = require('./config.json');
const pool = mysql.createPool({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  database: conf.database,
  port: conf.port
});

module.exports.responseHeader = async (event, context, callback) => {
  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'false',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
    },
    body: JSON.stringify(event)
  };
  console.log(response);

  callback(null, response);
  // callback(null, JSON.stringify(response));
};

module.exports.handleEvent = async (event, context) => {
  let params;
  if (!event.body) {
    params = event;
  } else if (event.body.data) {
    console.log(event.body.data);
    params = event.body;
  } else {
    try {
      let body = JSON.parse(event.body);
      params = body.data;
    } catch (error) {
      requestBody = qs.parse(event.body);
      Object.keys(requestBody).map(
        key => (requestBody[key] = JSON.parse(requestBody[key]))
      );
      params = requestBody.data;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event
    })
  };
};
