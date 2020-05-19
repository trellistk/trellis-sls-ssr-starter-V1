'use strict';
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

module.exports.createUser = async (event, context) => {
  const body = JSON.parse(event.body)
  const username = body.username
  const password = body.password
  const newUserParams = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Item: {
      pk: username,
      password: bycrypt.hashSync(password, 10)
    }
  }
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const putResult = await dynamodb.put(newuserParams).promise()
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Authorization'
      }
    }
  } catch(putError) {
    console.log('There was an error creating the new user')
    console.log('putError', putError)
    console.log('newUserParams', newUserParams)
    return new Error('There was an error creating the new user')
  }
}