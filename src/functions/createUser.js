'use strict';
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
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
exports.createUser = async (event, context) => {
  try {
    const data = JSON.parse(event.body)

    const user = {
        id: uuidv4(),
        username: data.username,
        password: bcrypt.hashSync(data.password, 10),
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