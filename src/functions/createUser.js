'use strict';
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../../database/dynamodb');
const response = require('../../helpers/response');

const usersTable = process.env.DYNAMODB_TABLE;

module.exports.createUser = (event, context, callback) => {
  const reqBody = JSON.parse(event.body)

  const user = {
      id: uuidv4(),
      username: reqBody.username,
      password: bcrypt.hashSync(reqBody.password, 10),
      city: reqBody.city,
      deliveryDay: reqBody.deliveryDay
    }

  return db.put({
    TableName: usersTable,
    Item: user
  }).promise().then(() => {
    callback(null, response(201, user))
  })
  .catch(err => response(null, response(err.statusCode, err)));
}