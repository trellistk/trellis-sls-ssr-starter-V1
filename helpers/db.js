'use strict'

const db = require('../database/dynamodb')
const TableName = process.env.DYNAMODB_TABLE

/**
 * @description Creates DynamoDB documents
 * @param {*} param
 */
module.exports.createDocument = async ({
  chapter, // primary key/chapter name
  docSort, // sort key/document type
  attributes // other attributes
}) => {
  attributes.chapter = chapter
  attributes.docSort = docSort

  const params = {
    TableName,
    Item: { ...attributes },
    ConditionExpression: 'attribute_not_exists(docSort)'
  }

  try {
    await db.put(params).promise()
    return { }
  } catch (error) {
    return { error }
  }
}

// TODO Implement
module.exports.queryDeliveryList = async (docSort, city, deliveryDay) => {
  const params = {
    TableName,
    KeyConditionExpression: 'chapter = :chapter',
    FilterExpression: 'address.city = :city AND deliveryDay = :deliveryDay',
    ExpressionAttributeValues: {
      ':chapter': docSort,
      ':city': city,
      ':deliveryDay': deliveryDay
    }
  }
  try {
    const deliveryList = await db.query(params).promise()
    return deliveryList
  } catch (error) {
    return { error }
  };
}

/**
 * @description Retrieves a DynamoDB Document
 * @param {*} chapter
 * @param {*} sortKey
 */
module.exports.getDocument = async (chapter, docSort) => {
  const params = {
    TableName,
    Key: {
      chapter,
      docSort
    }
  }

  try {
    const res = await db.get(params).promise()

    if (!res.Item) {
      return { error: 'User not found' }
    }

    return { data: res.Item }
  } catch (error) {
    return { error }
  }
}

/**
 * @description Helper. Filter and builds the attributes
 * to help us get around reserved keywords
 * @param {*} userInfo
 */
const updateUserExpressionHelper = userInfo => {
  const processed = {
    UpdateExpression: 'set',
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {}
  }
  for (const key in userInfo) {
    const val = userInfo[key]

    if (val) {
      // 'state' is reserved so we have to rename it
      if (key === 'state') {
        processed.UpdateExpression += ` #us${key} = :${key},`
        processed.ExpressionAttributeValues[`:${key}`] = val
        processed.ExpressionAttributeNames[`#us${key}`] = `:${key}`
        continue
      }
      processed.UpdateExpression += ` #${key} = :${key},`
      processed.ExpressionAttributeValues[`:${key}`] = val
      processed.ExpressionAttributeNames[`#${key}`] = `:${key}`
    }
  }
  // remove the last comma
  processed.UpdateExpression = processed.UpdateExpression.slice(0, -1)
  return processed
}

/**
 * @description Helper. Custom attribute names have extra characters
 * This removes those from the keys in the object.
 * @param {*} updateData
 */
const updateUserCleanObj = updateData => {
  const newObj = {}
  for (const key in updateData) {
    const newKey = key.slice(1)
    newObj[newKey] = updateData[key]
  }
  return newObj
}

/**
 * @description Updates a Family's document. Only supports updating of family details. Does not include email and password
 * @param {*} chapter
 * @param {*} sortKey
 * @param {*} attributes
 */
module.exports.updateFamilyDocument = async (chapter, docSort, attributes) => {
  const processedExpression = updateUserExpressionHelper(attributes)

  const params = {
    TableName,
    Key: {
      chapter,
      docSort
    },
    ConditionExpression: 'attribute_exists(docSort)',
    UpdateExpression: processedExpression.UpdateExpression,
    ExpressionAttributeValues: processedExpression.ExpressionAttributeValues,
    ExpressionAttributeNames: processedExpression.ExpressionAttributeNames,
    ReturnValues: 'UPDATED_NEW'
  }

  try {
    const { Attributes: updatedInfo } = await db.update(params).promise()
    return {
      info: updateUserCleanObj(updatedInfo)
    }
  } catch (error) {
    return { error }
  }
}

/**
 * @description Updates a user's login password.
 * @param {*} chapter
 * @param {*} sortKey
 * @param {*} attributes
 */
module.exports.updateUserPassword = async (chapter, docSort, attributes) => {
  const processedExpression = updateUserExpressionHelper(attributes)

  const params = {
    TableName,
    Key: {
      chapter,
      docSort
    },
    ConditionExpression: 'attribute_exists(docSort)',
    UpdateExpression: processedExpression.UpdateExpression,
    ExpressionAttributeValues: processedExpression.ExpressionAttributeValues,
    ExpressionAttributeNames: processedExpression.ExpressionAttributeNames,
    ReturnValues: 'NONE'
  }

  try {
    const { Attributes: updatedInfo } = await db.update(params).promise()
    return {
      info: updateUserCleanObj(updatedInfo)
    }
  } catch (error) {
    return { error }
  }
}

module.exports.deleteDocument = async (chapter, docSort) => {
  const params = {
    TableName,
    Key: {
      chapter,
      docSort
    },
    ReturnValues: 'ALL_OLD'
  }

  try {
    const { Attributes: deletedInfo } = await db.delete(params).promise()
    return {
      info: updateUserCleanObj(deletedInfo)
    }
  } catch (error) {
    return { error }
  }
}
