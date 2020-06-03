'use strict';
const AWS = require('aws-sdk');
const db = require('../../database/dynamodb');

const usersTable = process.env.DYNAMODB_TABLE;

// async function abstraction
async function updateItem(city, username, deliveryDay) {
  const params = {
    TableName: usersTable,
    Key: {
      city,
      username
    },
    ConditionExpression: 'attribute_exists(city) AND attribute_exists(username)',
    UpdateExpression: 'set deliveryDay = :v',                //How to set this to be anything?
    ExpressionAttributeValues: {
      ':v': deliveryDay
    },
    ReturnValues: 'ALL_NEW'
  }
  try {
    await db.update(params).promise()
  } catch (err) {
    return err
  }
}

// usage
module.exports.updateUser = async (event, context) => {
  try {
    const { city, username, deliveryDay } = JSON.parse(event.body);
    const response = await updateItem(city, username, deliveryDay)
    if (response) {
      return { 
        statusCode: response.statusCode,
        body: JSON.stringify(response)
      }
    } else {
      return {
        statusCode: 200,
        body: "User updated successfully!"
      }
    }
  } catch (err) {
        return { error: err }
    }
}