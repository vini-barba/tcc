'use strict';

var AWS = require('aws-sdk');
// Set the region
// AWS.config.update({ region: 'us-east-1' });

class Templates {
  chooseTemp(data) {
    var temp = {
      Source: 'no-reply@blood4pets.awsapps.com',
      Destination: {
        ToAddresses: []
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: null
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: null
          },
          Text: {
            Charset: 'UTF-8',
            Data: null
          }
        }
      }
    };
    switch (data.template) {
      case 'muda-status-animal-doador':
        temp.Destination.ToAddresses.push(data.address);
        temp.Message.Subject.Data = 'Atualização de animal';
        temp.Message.Body.Html.Data = `
        <h1>Mudança de status de animal</h1>
        <p>O animal ${data.animal.nome} de Id ${
          data.animal.id
        } já está ápto a doar novamente, pois o tempo mínimo necessário de espera entre uma doação e outra ja foi cumprido</p>
        <p>para ver os pedidos e campanhas abertos <a href='https://www.blood4pets.tk/#/area-usuario/pedidos-campanhas'>acesse</a> a nossa plataforma </p>
        <p>Att. equipe blood4pets</p>`;
        temp.Message.Body.Text.Data = `Mudança de status de animal
        O animal ${data.animal.nome} de Id ${
          data.animal.id
        } já está ápto a doar novamente, pois o tempo mínimo necessário de espera entre uma doação e outra ja foi cumprido.
        Para ver os pedidos e campanhas abertos acesse a nossa plataforma: blood4pets.tk
        Att. equipe blood4pets `;
        return temp;

      case 'muda-status-campanha':
        temp.Destination.ToAddresses.push(data.address);
        temp.Message.Subject.Data = 'Encerramento de campanha';
        temp.Message.Body.Html.Data = `
        <h1>Campanha encerrada</h1>
        <p>A sua campanha de id ${
          data.campanha
        } foi encerrada automaticamente pois atingiu a data definida de encerramento.</p>
        <p>Para abrir uma nova campanha <a href='https://www.blood4pets.tk/#/area-usuario/cadastro-campanha'>acesse</a> a nossa plataforma </p>
        <p>Att. equipe blood4pets</p>`;
        temp.Message.Body.Text.Data = `
        Campanha encerrada
        A sua campanha de id ${
          data.campanha
        } foi encerrada automaticamente pois atingiu a data definida de encerramento.
        Para abrir uma nova campanha acesse a nossa plataforma: https://www.blood4pets.tk/#/area-usuario/cadastro-campanha 
        Att. equipe blood4pets`;
        return temp;

      case 'muda-status-pedido':
        temp.Destination.ToAddresses.push(data.address);
        temp.Message.Subject.Data = 'Encerramento de pedido';
        temp.Message.Body.Html.Data = `
        <h1>Pedido encerrado</h1>
        <p>A seu pedido de id ${data.pedido}, para o animal ${
          data.animal.nome
        } foi encerrado automaticamente pois atingiu a data limite definida pelo nosso sistema.</p>
        <p>Para reativar este pedido <a href='https://www.blood4pets.tk/#/area-usuario/pedido/${
          data.pedido
        }'>acesse</a> a nossa plataforma </p>
        <p>Att. equipe blood4pets</p>`;
        temp.Message.Body.Text.Data = `
        Pedido encerrado
        A seu pedido de id ${data.pedido}, para o animal ${
          data.animal.nome
        } foi encerrado automaticamente pois atingiu a data limite definida pelo nosso sistema.
        Para reativar este pedido acesse a nossa plataforma: https://www.blood4pets.tk/#/area-usuario/pedido/${
          data.pedido
        }
        Att. equipe blood4pets`;
        return temp;

      default:
        return null;
    }
  }
}
module.exports.sendEmail = async (event, context, callback) => {
  console.log(event);
  let payloads = event.rows[0];
  let promiseArrArr = [];
  await payloads.forEach(element => {
    console.log(element);
    let data = {
      template: event.template,
      address: null,
      animal: { nome: null, id: null },
      pedido: null,
      campanha: null
    };
    data.address = element.EMAIL || null;
    data.animal.nome = element.NOME || null;
    data.animal.id = element.PK_ANIMAL || null;
    data.pedido = element.PK_PEDIDO_DOACAO || null;
    data.campanha = element.PK_CAMPANHA_DOACAO || null;
    console.log(data);

    let tempEmail = new Templates().chooseTemp(data);

    promiseArrArr.push(new AWS.SES().sendEmail(tempEmail).promise());
  });

  return Promise.all(promiseArrArr).then(arrArr => {
    console.log('teste:');

    console.log(arrArr);
    callback(null, {});
  });
};
