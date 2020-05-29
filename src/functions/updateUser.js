'use strict';
const AWS = require('aws-sdk');
const db = require('../../database/dynamodb');
const response = require('../../helpers/response');

const usersTable = process.env.DYNAMODB_TABLE;

module.exports.updateUser = (event, context, callback) => {
  const { city, username } = event.pathParameters;     // Change with Slack Integration?
  const body = JSON.parse(event.body);
  //const paramName = body.paramName;
  //const paramValue = body.paramValue;
  const deliveryDay = body.deliveryDay;

  const params = {
    TableName: usersTable,
    Key: {
      city: city,
      username: username
    },
    ConditionExpression: 'attribute_exists(city) AND attribute_exists(username)',
    UpdateExpression: 'set deliveryDay = :v',                //How to set this to be anything with Slack Form?
    ExpressionAttributeValues: {
      ':v': deliveryDay
    },
    ReturnValues: 'ALL_NEW'
  };

  return db.update(params).promise().then(res => {
    callback(null, response(200, res.Attributes))
  }).catch(err => response(err.statusCode, err));
}