'use strict'

const db = require('../database/dynamodb')
const TableName = process.env.DYNAMODB_TABLE

/**
 * @description Creates DynamoDB documents
 * @param {*} param
 */
module.exports.createDocument = async ({
  chapter, // primary key/chapter name
  documentSort, // sort key/document type
  attributes // other attributes
}) => {
  attributes.chapterState = chapter
  attributes.chapterDocument = documentSort

  const params = {
    TableName,
    Item: {...attributes},
    ConditionExpression: 'attribute_not_exists(chapterDocument)'
  }

  try {
    await db.put(params).promise()
    return { }
  } catch (error) {
    return { error }
  }
}

// TODO Implement
module.exports.queryDeliveryList = async (partitionKey, city, deliveryDay) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_QUERY_DELIVERY_LIST'
  })
  const params = {
    TableName: nouriChapters,
    KeyConditionExpression: 'chapterState = :chapterState',
    FilterExpression: 'address.city = :city AND deliveryDay = :deliveryDay',
    ExpressionAttributeValues: {
      ':chapterState': partitionKey,
      ':city': city,
      ':deliveryDay': deliveryDay
    }
  }
  logInfo('STEP_PARAMS_CREATED', params)
  try {
    const deliveryList = await db.query(params).promise()
    logInfo('STEP_DELIVERY_LIST_CREATED', deliveryList)
    return deliveryList
  } catch (error) {
    logError('ERROR_RETRIEVING_DELIVERY_LIST', error)
    return { error }
  };
}

/**
 * @description Retrieves a DynamoDB Document
 * @param {*} chapter 
 * @param {*} sortKey 
 */
module.exports.getDocument = async (chapter, sortKey) => {
  const params = {
    TableName,
    Key: {
      chapterState: chapter,
      chapterDocument: sortKey
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

// TODO Method for updating just the username and password.
// NOTE: will likely need to delete old entry and re-add the new entry.

/**
 * @description Helper. Filters builds the attributes
 * and help us get around reserved keywords
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
module.exports.updateFamilyDocument = async (chapter, sortKey, attributes) => {
  const processedExpression = updateUserExpressionHelper(attributes)

  const params = {
    TableName,
    Key: {
      chapterState: chapter,
      chapterDocument: sortKey
    },
    ConditionExpression: 'attribute_exists(chapterDocument)',
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
