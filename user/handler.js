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

module.exports.readUsers = async (event, context) => {
  let params = event.queryStringParameters;
  let col = [];
  let data = [];
  let query = `SELECT * FROM TB_USUARIO`;
  if (params) {
    if (params.atributo) {
      col.push(params.atributo);
      data.push(params[params.atributo]);
      query += ` WHERE ?? = ?`;
    }
  }
  let response;
  return new Promise(function(resolve, reject) {
    pool.query(query, [col, data], function(err, rows, fields) {
      if (err) reject({ error: err });
      else {
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

module.exports.createUser = async (event, context, callback) => {
  let query;
  console.log(event);
  let data = [];
  if (event.request.userAttributes['custom:clinicaNome']) {
    let params = event.request.userAttributes;
    let clinicaNome = params['custom:clinicaNome'];
    let clinicaCnpj = null;
    let clinicaTelefone = null;
    let clinicaEmail = params['email'];
    let regiaoUf = null;
    let regiaoCidade = null;
    let regiaoCep = null;
    let regiaoEndereco = null;
    let regiaoNumero = null;
    let regiaoBairro = null;
    let regiaoComplemento = null;
    let regiaoLatitude = null;
    let regiaoLongitude = null;
    if (params['custom:cnpj']) clinicaCnpj = params['custom:cnpj'];
    if (params['custom:telefone']) clinicaTelefone = params['custom:telefone'];
    if (params['custom:endereco']) regiaoEndereco = params['custom:endereco'];
    if (params['custom:uf']) regiaoUf = params['custom:uf'];
    if (params['custom:cidade']) regiaoCidade = params['custom:cidade'];
    if (params['custom:cep']) regiaoCep = params['custom:cep'];
    if (params['custom:bairro']) regiaoBairro = params['custom:bairro'];
    if (params['custom:numeroEndereco'])
      regiaoNumero = params['custom:numeroEndereco'];
    if (params['custom:complementoEndereco'])
      regiaoComplemento = params['custom:complementoEndereco'];

    data = [
      event.userName,
      clinicaNome,
      clinicaCnpj,
      clinicaTelefone,
      clinicaEmail,
      regiaoUf,
      regiaoCidade,
      regiaoCep,
      regiaoEndereco,
      regiaoNumero,
      regiaoBairro,
      regiaoComplemento,
      regiaoLatitude,
      regiaoLongitude
    ];
    query = `CALL cadastrar_clinica( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
  } else {
    data = [event.userName, event.request.userAttributes.email];
    query = `insert into TB_USUARIO values ( null, 1, ? ,? , null, null, null, null, now(), null );`;
  }

  console.log(query);
  return new Promise((resolve, reject) => {
    pool.query(query, data, function(err, rows, fields) {
      if (err) {
        event.data = null;
        event.userName = null;
        event.request.userAttributes.email = null;

        console.log(event);
        // aws.Request.send()
        resolve(context.done(null, event));
      }
      if (rows) {
        console.log(event);
        resolve(context.done(null, event));
      }
    });
  });
};
