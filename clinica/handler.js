'use strict';
var mysql = require('mysql');
let conf = require('./config.json');
const pool = mysql.createPool({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  database: conf.database,
  port: conf.port,
  multipleStatements: true
});
var aws = require('aws-sdk');
var lambda = new aws.Lambda({
  region: 'us-east-1'
});
module.exports.setClinica = async (event, context, callback) => {
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

  let query = '';

  return new Promise(resolve => {
    pool.query(query, function(err, rows, fields) {
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

module.exports.getClinica = async (event, context, callback) => {
  console.log(event);
  let query = `  select * from  TB_CLINICA`;

  let params = event.queryStringParameters;
  console.log(params);
  let data = [];
  if (params) {
    if (params.clinicaId && !params.clinicaName) {
      data = [params.clinicaId];
      query += ` where PK_CLINICA = ?`;
    }
    if (params.clinicaName && !params.clinicaId) {
      data = [params.clinicaName];
      query += ` where USERNAME = ?`;
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

module.exports.setCampanha = async (event, context, callback) => {
  // Handling multiple event formats

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
  if (!params.clinicaId) {
    return (response.body = JSON.stringify({
      clinica: 'Clinica é um parametro obrigatório'
    }));
  }
  if (!params.regiao) {
    return (response.body = JSON.stringify({
      regiao: 'Regiao é um parametro obrigatório'
    }));
  }
  if (!params.campanha) {
    return (response.body = JSON.stringify({
      campanha: 'Campanha é um parametro obrigatório'
    }));
  }

  let clinicaId = params.clinicaId;

  let campanhaMotivo = params.campanha.motivo || null;
  let campanhaAnimalTipo = params.campanha.animalTipo || null;
  let campanhaDtIni = params.campanha.dtIni;

  let campanhaDtFim = params.campanha.dtFim;
  let campanhaPhone = params.campanha.telefone || null;

  let regiaoCep = params.regiao.regiaoCep;
  let regiaoUf = params.regiao.regiaoUf || null;
  let regiaoCidade = params.regiao.regiaoCidade || null;
  let regiaoEndereco = params.regiao.regiaoEndereco || null;
  let regiaoBairro = params.regiao.regiaoBairro || null;

  let regiaoNumero = null;
  if (params.regiao.regiaoNumero) {
    regiaoNumero = params.regiao.regiaoNumero;
  }

  let regiaoComplemento = null;
  if (params.regiao.regiaoComplemento) {
    regiaoComplemento = params.regiao.regiaoComplemento;
  }

  let regiaoLatitude = null;
  if (params.regiao.regiaoLatitude)
    regiaoLatitude = params.regiao.regiaoLatitude;
  let regiaoLongitude = null;
  if (params.regiao.regiaoLongitude)
    regiaoLongitude = params.regiao.regiaoLongitude;

  let data = [
    clinicaId,
    campanhaAnimalTipo,
    campanhaMotivo,
    campanhaDtIni,
    campanhaDtFim,
    campanhaPhone,
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

  let query = `CALL  cadastrar_campanha( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,@output); select @output`;

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

module.exports.getCampanha = async (event, context, callback) => {
  console.log(event);
  let query = `select 
	cp.PK_CAMPANHA_DOACAO,
    cp.FK_STATUS,
    cp.MOTIVO,
    cp.DT_INICIO_CAMPANHA,
    cp.DT_FIM_CAMPANHA,
    cp.FK_TIPO_ANIMAL,
    cp.TELEFONE,
    r.UF,
	r.CIDADE,
	r.CEP,
	r.ENDERECO,
	r.NUMERO,
	r.BAIRRO,
	r.COMPLEMENTO,
	r.LATITUDE,
	r.LONGITUDE,
    c.NOME,
	c.TELEFONE,
  c.EMAIL,
  c.PK_CLINICA
from TB_CAMPANHA_DOACAO as cp
join TB_REGIAO as r
join TB_CLINICA as c
where
	cp.FK_REGIAO = r.PK_REGIAO
    and cp.FK_CLINICA = c.PK_CLINICA`;

  let params = event.queryStringParameters;
  console.log(params);
  let data = [];

  if (params) {
    if (params.clinicaId) {
      data.push(params.clinicaId);
      query += ` and c.PK_CLINICA = ?`;
    }
  }
  if (params) {
    if (params.campanhaId) {
      data.push(params.campanhaId);
      query += ` and cp.PK_CAMPANHA_DOACAO = ?`;
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

module.exports.mudaStatusCampanhaAuto = async (event, context, callback) => {
  let query = `select clinica.EMAIL, camp.PK_CAMPANHA_DOACAO from TB_CAMPANHA_DOACAO camp join TB_CLINICA clinica where camp.FK_CLINICA = clinica.PK_CLINICA and DT_FIM_CAMPANHA < now() and camp.FK_STATUS = 1; update TB_CAMPANHA_DOACAO set FK_STATUS= 2, DT_ALTERACAO = now() where DT_FIM_CAMPANHA < now() and FK_STATUS = 1;`;

  return new Promise(resolve => {
    pool.query(query, function(err, rows, fields) {
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
          FunctionName: 'email-dev-sendEmail',
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify({
            template: 'muda-status-campanha',
            rows: rows
          })
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
