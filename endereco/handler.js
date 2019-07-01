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
var aws = require('aws-sdk');
var lambda = new aws.Lambda({
  region: 'us-east-1'
});

module.exports.getEndereco = async (event, context, callback) => {
  console.log(event);
  let query = `  select * from  TB_REGIAO`;

  let params = event.queryStringParameters;
  console.log(params);
  let data = [];
  if (params) {
    if (params.enderecoId) {
      data = [params.enderecoId];
      query += ` where PK_REGIAO = ?`;
    }
  }
  console.log(query);
  return new Promise(resolve => {
    pool.query(query, data, function(err, rows, fields) {
      if (err) {
        console.log(err);
        {
          response.body = { error: 'error' };
          console.log('error: ');
          console.log(response);

          reject(response);
        }
      } else {
        const paramsFunc = {
          FunctionName: 'helper-dev-responseHeader',
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify(rows)
        };
        return lambda.invoke(paramsFunc, (err, data) => {
          if (err) {
            console.error(JSON.stringify(error));
            return new Error(`Error : ${JSON.stringify(error)}`);
          } else if (data) {
            let teste = JSON.parse(data.Payload);
            return resolve(teste);
          }
        });
      }
    });
  });
};
