'use strict';
const AWS = require('aws-sdk');
const db = require('../../database/dynamodb');
const response = require('../../helpers/response');

const usersTable = process.env.DYNAMODB_TABLE;

module.exports.getUsersPerCity = (event, context, callback) => {
  const { city } = event.pathParameters;
  const params = {
    TableName: usersTable,
    KeyConditionExpression: "#ct = :city",
    ExpressionAttributeNames:{
      "#ct": "city"
    },
    ExpressionAttributeValues: {
      ":city": city
    }
  };
  return db.query(params).promise().then(res => {
    callback(null, response(200, res.Items))
  }).catch(err => response(err.statusCode, err));
}