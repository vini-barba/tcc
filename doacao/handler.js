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

module.exports.setDoacao = async (event, context, callback) => {
  console.log(event);

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
  console.log(params);

  if (!params.doacaoId && !params.campanhaId) {
    return (response.body = JSON.stringify({
      pedido: 'pedido/campanha é um parametro obrigatório'
    }));
  }
  if (!params.animalDoador) {
    return (response.body = JSON.stringify({
      animalDoador: 'O animal é um parametro obrigatório'
    }));
  }
  if (!params.dtDoacao) {
    return (response.body = JSON.stringify({
      dtDoacao: 'A data da doação é um parametro obrigatório'
    }));
  }

  let pedido = null;
  let campanha = null;
  let animalDoador = params.animalDoador;
  let dtDoacao = params.dtDoacao;

  if (params.doacaoId) {
    pedido = params.doacaoId;
  }
  if (params.campanhaId) {
    campanha = params.campanhaId;
  }
  let data = [pedido, campanha, animalDoador, dtDoacao];
  let query = `CALL registrar_doacao( ?, ?, ?, ?);`;
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

module.exports.getDoacao = async (event, context, callback) => {
  console.log(event);
  let query = `
  SELECT 
    doador.PK_ANIMAL_DOADOR, 
      animal.PK_ANIMAL, 
      animal.nome, 
      animal.FK_SANGUE, 
      animal.FK_USUARIO, 
      animal.FK_STATUS, 
      animal.DT_NASCIMENTO, 
      animal.PESO, 
      doacao.DT_DOACAO, 
      doacao.PK_DOACAO
  FROM TB_ANIMAL as animal
    inner JOIN TB_DOACAO as doacao 
      inner join TB_ANIMAL_DOADOR as doador 
  where doador.PK_ANIMAL_DOADOR = doacao.FK_ANIMAL_DOADOR and doador.FK_ANIMAL = animal.PK_ANIMAL`;

  let params = event.queryStringParameters;
  console.log(params);
  let data = [];
  if (params) {
    if (params.animalId) {
      data = [params.animalId];
      query += ` and animal.FK_USUARIO = ?`;
    }
    if (params.pedidoId) {
      data = [params.pedidoId];
      query += ` and doacao.FK_PEDIDO_DOACAO = ?`;
    }
    if (params.campanhaId) {
      data = [params.campanhaId];
      query += ` and doacao.FK_CAMPANHA_DOACAO = ?`;
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
