'use strict';
const AWS = require('aws-sdk');
//const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');
const db = require('../../database/dynamodb');
const bcrypt = require('bcryptjs');

const { httpResponse } = require('../../helpers/response')

const usersTable = process.env.DYNAMODB_TABLE;

// async function abstraction
async function createItem(itemData) {
  var params = {
    TableName: usersTable,
    Item: itemData,
    ConditionExpression: 'attribute_not_exists(username)'
  }
  try {
    await db.put(params).promise()
  } catch (err) {
    return err
  }
}

// usage
module.exports.createUser = async (event, context) => {
  console.log('IS OFFLINE?', process.env.IS_OFFLINE)
  console.info('START_CREATING_NEW_USER')
  try {
    console.info('STEP_GETTING_EVENT_BODY', event.body)
    const data = JSON.parse(event.body)
    console.info('STEP_PARSED_EVENT_BODY', data)
    // const hash = await argon2.hash(data.password, {
    //   type:argon2.argon2id,
    //   memoryCost: 2 ** 19,
    //   timeCost: 8,
    //   parallelism: 8
    // }).catch(err => {
    //   console.error('Error with Argon2 hasing', err)
    // })
    // console.info('STEP_HASH', hash)

    const user = {
      id: uuidv4(),
      username: data.username,
      password: bcrypt.hashSync(data.password, 10),
      city: data.city,
      deliveryDay: data.deliveryDay
    }
    console.info('STEP_BUILT USER DATE', user)
    const response = await createItem(user)
    console.info('STEP_CREATED_ITEM', response)
    if (response) {
      return httpResponse(200, response)
      // return { 
      //   statusCode: response.statusCode,
      //   body: JSON.stringify(response)
      // }
    } else {
      return httpResponse(201, user)
      // return {
      //   statusCode: 201,
      //   body: JSON.stringify(user)
      // }
    }
  } catch (err) {
    console.error('ERROR_CREATING_NEW_USER', err)
    // return { error: err }
    return httpResponse(400, { error: err })
  }
}