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
const now = {
  toSqlString: function() {
    return 'now()';
  }
};
var aws = require('aws-sdk');
var lambda = new aws.Lambda({
  region: 'us-east-1'
});

//tipo animal
module.exports.getAnimalType = async (event, context, callback) => {
  console.log(event);
  let query = `SELECT * FROM TB_TIPO_ANIMAL`;

  let params = event.queryStringParameters;
  let col = [];
  let data = [];
  if (params) {
    if (params.atributo) {
      col.push(params.atributo);
      data.push(params[params.atributo]);
      query += ` WHERE ?? = ?`;
    }
  }

  return new Promise(resolve => {
    pool.query(query, [col, data], function(err, rows, fields) {
      if (err) {
        console.log(err);
        {
          console.log('error: ');
          console.log(err);
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

module.exports.setAnimalType = async (event, context, callback) => {
  // Handling multiple event formats

  let params = null;
  if (!event.body) {
    params = event;
  } else if (event.body.data) {
    console.log(event.body.data);
    params = event.body;
  } else {
    try {
      let body = JSON.parse(event.body);
      console.log(body);

      params = body.data;
      console.log(params);
    } catch (error) {
      requestBody = qs.parse(event.body);
      Object.keys(requestBody).map(
        key => (requestBody[key] = JSON.parse(requestBody[key]))
      );
      params = requestBody.data;
    }
  }
  console.log(event);

  console.log(params);

  let insert = { TIPO_ANIMAL: params.animal, DT_INCLUSAO: now };
  let query = `insert into TB_TIPO_ANIMAL SET ?`;

  console.log(query);
  console.log(insert);

  return new Promise(resolve => {
    pool.query(query, insert, function(err, rows, fields) {
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

//animal
module.exports.getAnimal = async (event, context, callback) => {
  console.log(event);
  let query = `SELECT * FROM TB_ANIMAL`;

  let params = event.queryStringParameters;

  console.log(params);

  let data = [];
  if (params) {
    if (params.userId) {
      data.push(params.userId);
      query += ` where FK_USUARIO = ?`;
    }
  }

  return new Promise(resolve => {
    pool.query(query, [data], function(err, rows, fields) {
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
module.exports.setAnimal = async (event, context, callback) => {
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

  if (!params.sangue) {
    return (response.body = JSON.stringify({
      sangue: 'Sangue é um parametro obrigatório'
    }));
  }
  if (!params.tipoAnimal) {
    return (response.body = JSON.stringify({
      tipoAnimal: 'O tipo do animal é um parametro obrigatório'
    }));
  }
  if (!params.nome) {
    return (response.body = JSON.stringify({
      nome: 'O nome do animal é um parametro obrigatório'
    }));
  }

  let dtNasc = params.nascAnimal || null;
  let peso = params.pesoAnimal || null;
  let doador = params.doador || null;
  let insert = {
    FK_SANGUE: params.sangue,
    FK_USUARIO: params.userId,
    FK_TIPO_ANIMAL: params.tipoAnimal,
    FK_STATUS: 1,
    NOME: params.nomeAnimal,
    DT_NASCIMENTO: dtNasc,
    PESO: peso,
    FLG_DOADOR: doador,
    DT_INCLUSAO: now
  };
  let query = `insert into TB_ANIMAL values SET ?`;

  return new Promise(resolve => {
    pool.query(query, insert, function(err, rows, fields) {
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
//animal doador
module.exports.getAnimalDonor = async (event, context, callback) => {
  console.log(event);
  let query = `	SELECT animal.PK_ANIMAL, animal.nome, animal.FK_SANGUE, animal.FK_USUARIO, animal.FK_STATUS, animal.DT_NASCIMENTO, animal.PESO, animal.FK_TIPO_ANIMAL, doador.DT_ULT_DOACAO, doador.FLG_PODE_DOAR, doador.PK_ANIMAL_DOADOR
	FROM TB_ANIMAL as animal
	inner JOIN TB_ANIMAL_DOADOR as doador where animal.PK_ANIMAL = doador.FK_ANIMAL`;

  let data = [];
  let params = event.queryStringParameters;
  if (params) {
    if (params.userId) {
      data.push(params.userId);
      query += ` and animal.FK_USUARIO = ?`;
    }
  }

  return new Promise(resolve => {
    pool.query(query, [data], function(err, rows, fields) {
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
module.exports.setAnimalDonor = async (event, context, callback) => {
  // Handling multiple event formats
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

  if (!params.userId) {
    return (response.body = JSON.stringify({
      usuario: 'Usuário é um parametro obrigatório'
    }));
  }
  if (!params.tipoAnimal) {
    return (response.body = JSON.stringify({
      tipoAnimal: 'O tipo do animal é um parametro obrigatório'
    }));
  }

  let sangue = params.sangue;
  let userId = params.userId;
  let tipoAnimal = params.tipoAnimal;
  let nome = params.nomeAnimal;
  let dtNasc = params.nascAnimal;
  let peso = params.pesoAnimal;
  let doador = null;
  if (params.doador) {
    doador = 's';
  } else {
    doador = 'n';
  }

  let query = `CALL cadastrar_animal_doador(?, ?, ?, ?, ?, ?, ?,@output); select @output`;
  console.log(query);

  return new Promise(resolve => {
    pool.query(
      query,
      [sangue, userId, tipoAnimal, nome, dtNasc, peso, doador],
      function(err, rows, fields) {
        if (err) {
          console.log(err);
          {
            response.body = { error: 'error' };
            console.log('error: ');
            console.log(response);

            reject(response);
          }
        } else {
          console.log(rows);
          console.log(fields);

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
      }
    );
  });
};

//animal receptor
module.exports.getAnimalReceptor = async (event, context, callback) => {
  console.log(event);
  let query = `select
	p.PK_PEDIDO_DOACAO,
    p.FK_STATUS,
    p.MOTIVO,
    p.DT_INICIO_PEDIDO,
    p.DT_FIM_PEDIDO,
    a.PK_ANIMAL,
    a.FK_SANGUE,
    a.FK_USUARIO,
    a.FK_TIPO_ANIMAL,
    a.NOME,
    r.UF,
	r.CIDADE,
	r.CEP,
	r.ENDERECO,
	r.NUMERO,
	r.BAIRRO,
	r.COMPLEMENTO,
	r.LATITUDE,
	r.LONGITUDE,
    c.NOME as NOME_CLINICA,
	c.TELEFONE,
	c.EMAIL
from TB_PEDIDO_DOACAO as p
join TB_ANIMAL as a
join TB_REGIAO as r
join TB_CLINICA as c
where p.FK_ANIMAL = a.PK_ANIMAL
	and p.FK_REGIAO = r.PK_REGIAO
    and p.FK_CLINICA = c.PK_CLINICA`;

  let params = event.queryStringParameters;
  console.log(params);
  let data = [];
  if (params) {
    if (params.animalId) {
      data.push(params.animalId);
      query += `  and a.PK_ANIMAL = ?`;
    }
    if (params.userId) {
      data.push(params.userId);
      query += `  and a.FK_USUARIO = ?`;
    }
    if (params.requestId) {
      data.push(params.requestId);
      query += `  and p.PK_PEDIDO_DOACAO = ?`;
    }
  }

  return new Promise(resolve => {
    pool.query(query, [data], function(err, rows, fields) {
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
module.exports.setAnimalReceptor = async (event, context, callback) => {
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

  if (!params.userId) {
    return (response.body = JSON.stringify({
      usuario: 'Usuário é um parametro obrigatório'
    }));
  }
  if (!params.animal) {
    return (response.body = JSON.stringify({
      animal: 'Animal é um parametro obrigatório'
    }));
  }
  if (!params.regiao) {
    return (response.body = JSON.stringify({
      regiao: ' regiao é um parametro obrigatório'
    }));
  }
  if (!params.pedido) {
    return (response.body = JSON.stringify({
      pedido: 'O pedido é um parametro obrigatório'
    }));
  }

  let userId = params.userId;
  let animalId = params.animal.animalId;

  let animalSangue = params.animal.animalSangue;
  let animalTipo = params.animal.animalTipo;
  let animalNome = params.animal.animalNome;
  let animalDtNasc = params.animal.animalDtNasc || null;
  let animalPeso = params.animal.animalPeso || null;
  let animalFlgDoador = params.animal.animalFlgDoador || null;

  let pedidoClinica = params.pedido.pedidoClinica;
  let pedidoMotivo = params.pedido.pedidoMotivo || null;
  let pedidoDtIni = null;
  if (params.pedido.pedidoDtIni) pedidoDtIni = params.pedido.pedidoDtIni;

  let pedidoDtFim = null;
  if (params.pedido.pedidoDtFim) pedidoDtFim = params.pedido.pedidoDtFim;
  console.log(pedidoDtIni);
  console.log(params.pedido.pedidoDtIni);
  let regiaoCep = params.regiao.regiaoCep;
  let regiaoUf = params.regiao.regiaoUf || null;
  let regiaoCidade = params.regiao.regiaoCidade || null;
  let regiaoEndereco = params.regiao.regiaoEndereco || null;
  let regiaoBairro = params.regiao.regiaoBairro || null;
  let regiaoNumero = params.regiao.regiaoNumero || null;
  let regiaoComplemento = params.regiao.regiaoComplemento || null;

  let regiaoLatitude = null;
  if (params.regiao.regiaoLatitude)
    regiaoLatitude = params.regiao.regiaoLatitude;
  let regiaoLongitude = null;
  if (params.regiao.regiaoLongitude)
    regiaoLongitude = params.regiao.regiaoLongitude;

  let query = ``;
  let data = [];
  if (!animalId) {
    data = [
      animalSangue,
      userId,
      animalTipo,
      animalNome,
      animalDtNasc,
      animalPeso,
      animalFlgDoador,
      regiaoUf,
      regiaoCidade,
      regiaoCep,
      regiaoEndereco,
      regiaoNumero,
      regiaoBairro,
      regiaoComplemento,
      regiaoLatitude,
      regiaoLongitude,
      pedidoClinica,
      pedidoMotivo,
      pedidoDtIni,
      pedidoDtFim
    ];
    query = `CALL fazer_pedido( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @output); select @output`;
  } else {
    data = [
      animalId,
      regiaoUf,
      regiaoCidade,
      regiaoCep,
      regiaoEndereco,
      regiaoNumero,
      regiaoBairro,
      regiaoComplemento,
      regiaoLatitude,
      regiaoLongitude,
      pedidoClinica,
      pedidoMotivo,
      pedidoDtIni,
      pedidoDtFim
    ];
    query = `CALL  fazer_pedido_animal_existente( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,@output); select @output`;
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

module.exports.mudaStatusDoadorAuto = async (event, context, callback) => {
  let query = `select animal.NOME, animal.PK_ANIMAL, usuarios.EMAIL from TB_ANIMAL_DOADOR doador join TB_ANIMAL animal join TB_USUARIO usuarios  where doador.FK_ANIMAL=animal.PK_ANIMAL and animal.FK_USUARIO= usuarios.PK_USUARIO and(DATEDIFF(now(), DT_ULT_DOACAO)>=90) and not FLG_PODE_DOAR ='s'; update TB_ANIMAL_DOADOR set FLG_PODE_DOAR = 's' where DATEDIFF(now(), DT_ULT_DOACAO)>=90 and not FLG_PODE_DOAR ='s'; `;

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
            template: 'muda-status-animal-doador',
            rows: rows
          })
        };
        console.log(rows);
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
module.exports.mudaStatusPedidoAuto = async (event, context, callback) => {
  let query = `select pedido.PK_PEDIDO_DOACAO, animal.NOME, animal.PK_ANIMAL, usuarios.EMAIL from TB_PEDIDO_DOACAO pedido join TB_ANIMAL animal join TB_USUARIO usuarios  WHERE pedido.FK_ANIMAL= animal.PK_ANIMAL and usuarios.PK_USUARIO = animal.FK_USUARIO and ( ((pedido.DT_ALTERACAO is null ) and DATEDIFF(now(), pedido.DT_INICIO_PEDIDO)>=30 and pedido.FK_STATUS = 1)or( (pedido.DT_ALTERACAO is not null ) and DATEDIFF(now(), pedido.DT_ALTERACAO)>=30 and pedido.FK_STATUS = 1));CALL muda_status_pedido_Auto() `;

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
            template: 'muda-status-pedido',
            rows: rows
          })
        };
        console.log(rows);

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

module.exports.mudaStatusPedido = async (event, context, callback) => {
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

  if (!params.pedidoId) {
    response.body = JSON.stringify({
      pedido: 'o pedido é um parametro obrigatório'
    });
    return response;
  }
  if (!params.status) {
    response.body = JSON.stringify({
      status: 'O status é um parametro obrigatório'
    });
    return response;
  }
  let data = [params.status, params.pedidoId];
  let query = ` update TB_PEDIDO_DOACAO set FK_STATUS = ?, DT_ALTERACAO= now() where PK_PEDIDO_DOACAO = ?;`;

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
