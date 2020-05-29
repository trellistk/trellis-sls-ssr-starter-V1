'use strict';
const AWS = require('aws-sdk');
const db = require('../../database/dynamodb');
const response = require('../../helpers/response');

const usersTable = process.env.DYNAMODB_TABLE;

module.exports.getUser = (event, context, callback) => {
  const { city, username } = event.pathParameters;     // Change with Slack Integration?
  const params = {
    TableName: usersTable,
    Key: {
      city: city,
      username: username
    }
  };
  return db.get(params).promise().then(res => {
    if(res.Item) callback(null, response(200, res.Item))
    else callback(null, response(404, { error: 'User not found'}))
  }).catch(err => response(err.statusCode, err));
}