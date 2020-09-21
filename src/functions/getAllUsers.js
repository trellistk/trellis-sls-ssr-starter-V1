'use strict'
const AWS = require('aws-sdk')
const db = require('../../database/dynamodb')
const { httpResponse } = require('../../helpers/response')

const usersTable = process.env.DYNAMODB_TABLE

// TODO for admins
module.exports.getAllUsers = (event, context, callback) => {
  return db.scan({
    TableName: usersTable
  }).promise().then(res => {
    callback(null, httpResponse(200, res.Items))
  }).catch(err => httpResponse(null, httpResponse(err.statusCode, err)))
}
