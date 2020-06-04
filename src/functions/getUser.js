'use strict';
const AWS = require('aws-sdk');
const db = require('../../database/dynamodb');

const usersTable = process.env.DYNAMODB_TABLE;

// async function abstraction
async function getItem(city, username) {
  const params = {
    TableName: usersTable,
    Key: {
      city,
      username
    }
  };
  try {
    const data = await db.get(params).promise();
    return data;
  } catch (err) {
    return err;
  }
}

// usage
module.exports.getUser = async (event, context) => {
  try {
    const { city, username } = JSON.parse(event.body);
    console.log('city = ' + city + ' and ' + 'username = ' + username);
    const response = await getItem(city, username);
    console.log('response = ' + response);
    return JSON.stringify(response);
  } catch (err) {
    return { body: err };
  }  
}