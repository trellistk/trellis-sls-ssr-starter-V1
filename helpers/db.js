'use strict'

const db = require('../database/dynamodb')
const usersTable = process.env.DYNAMODB_TABLE

module.exports.createItem = async (data) => {
  var params = {
    TableName: usersTable,
    Item: itemData,
    ConditionExpression: 'attribute_not_exists(username)'
  }
  try {
    const data = await db.put(params).promise()
    return { data }
  } catch (error) {
    return { error }
  }
}