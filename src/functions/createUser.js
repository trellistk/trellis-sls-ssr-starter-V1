'use strict';
const AWS = require('aws-sdk');
const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');
const db = require('../../database/dynamodb');

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
  try {
    const data = JSON.parse(event.body)
    const hash = await argon2.hash(data.password, {
      type:argon2.argon2id,
      memoryCost: 2 ** 19,
      timeCost: 8,
      parallelism: 8
    })

    const user = {
        id: uuidv4(),
        username: data.username,
        password: hash,
        city: data.city,
        deliveryDay: data.deliveryDay
      }
    const response = await createItem(user)
    if (response) {
      return { 
        statusCode: response.statusCode,
        body: JSON.stringify(response)
      }
    } else {
      return {
        statusCode: 201,
        body: JSON.stringify(user)
      }
    }
  } catch (err) {
        return { error: err }
    }
}