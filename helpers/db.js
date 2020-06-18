'use strict'

const db = require('../database/dynamodb')
const usersTable = process.env.DYNAMODB_TABLE

module.exports.createItem = async (data) => {
  var params = {
    TableName: usersTable,
    Item: data,
    ConditionExpression: 'attribute_not_exists(username)'
  }
  try {
    const response = await db.put(params).promise()
    return { data: response }
  } catch (error) {
    return { error }
  }
}