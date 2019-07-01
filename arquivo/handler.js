'use strict';

const AWS = require('aws-sdk');

let conf = require('./config.json');
const s3 = new AWS.S3({
  signatureVersion: conf.sigVersion,
  accessKeyId: conf.keyId,
  secretAccessKey: conf.secretAccessKey,
  region: conf.region
});
var aws = require('aws-sdk');
var lambda = new aws.Lambda({
  region: 'us-east-1'
});

module.exports.uploadUserPhoto = async (event, context, callback) => {
  let params = event.queryStringParameters;
  let paramsSignedUrl = {
    Bucket: 'hati-user-files',
    Key: params.userId + '/' + params.filename
  };

  const url = s3.getSignedUrl('putObject', paramsSignedUrl);
  console.log(paramsSignedUrl);
  console.log(url);

  // let response = {
  //   isBase64Encoded: false,
  //   statusCode: 200,
  //   headers: {
  //     "Access-Control-Max-Age": "86400",
  //     "Access-Control-Allow-Headers":
  //       "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
  //     "Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Credentials": "false",
  //     "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
  //   },
  //   body: JSON.stringify(url)
  // };

  const paramsFunc = {
    FunctionName: 'helper-dev-responseHeader',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(url)
  };
  await lambda
    .invoke(paramsFunc, (err, data) => {
      if (err) {
        console.error(JSON.stringify(error));
        return new Error(`Error : ${JSON.stringify(error)}`);
      } else if (data) {
        let teste = JSON.parse(data.Payload);
        console.log(teste);

        callback(null, teste);
      }
    })
    .promise();
  // callback(null, response);
};

module.exports.uploadAnimalPhoto = async (event, context, callback) => {
  let params = event.queryStringParameters;

  let paramsSignedUrl = {
    Bucket: 'hati-user-files',
    Key: params.userId + '/' + params.animalId + '/' + params.filename
  };
  const url = s3.getSignedUrl('putObject', paramsSignedUrl);
  console.log(paramsSignedUrl);
  console.log(url);

  const paramsFunc = {
    FunctionName: 'helper-dev-responseHeader',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(url)
  };
  await lambda
    .invoke(paramsFunc, (err, data) => {
      if (err) {
        console.error(JSON.stringify(error));
        return new Error(`Error : ${JSON.stringify(error)}`);
      } else if (data) {
        let teste = JSON.parse(data.Payload);
        console.log(teste);

        callback(null, teste);
      }
    })
    .promise();
};
