'use strict';
const AWS = require('aws-sdk');
const db = require('../../database/dynamodb');
const response = require('../../helpers/response');

const usersTable = process.env.DYNAMODB_TABLE;

function sortByCity(a,b){
  if(a.city > b.city){
    return -1;
  } else return 1;
}

module.exports.getAllUsers = (event, context, callback) => {
  return db.scan({
    TableName: usersTable
  }).promise().then(res => {
    callback(null, response(200, res.Items.sort(sortByCity)))
  }).catch(err => response(err.statusCode, err));
}