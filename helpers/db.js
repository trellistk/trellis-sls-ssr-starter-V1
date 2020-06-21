'use strict'

const db = require('../database/dynamodb')
const nouriChapters = process.env.DYNAMODB_TABLE
const logger = require('../helpers/logger')

module.exports.createChapterDocument = async (document) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_CREATE_DOCUMENT'
  })
  const params = {
    TableName: nouriChapters,
    Item: document,
    ConditionExpression: 'attribute_not_exists(chapterDocument)'
  }
  logInfo('STEP_PARAMS_CREATED', params)
  try {
    const newDocument = await db.put(params).promise()
    logInfo('STEP_DOCUMENT_CREATED', newDocument)
    return newDocument
  } catch (error) {
    logError('ERROR_CREATING_DOCUMENT', error)
    return { error }
  };
}

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

module.exports.getChapterDocument = async (partitionKey, sortKey) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_GET_CHAPTER_DOCUMENT'
  })
  const params = {
    TableName: nouriChapters,
    Key: {
      chapterState: partitionKey,
      chapterDocument: sortKey
    }
  }
  logInfo('STEP_DOCUMENT_PARAMETERS', params)
  try {
    const document = await db.get(params).promise()
    logInfo('STEP_DOCUMENT_RETRIEVED', document)
    return document
  } catch (error) {
    logError('ERROR_RETRIEVING_DOCUMENT', error)
    return { error }
  };
}

module.exports.updateUserDocument = async (partitionKey, sortKey, userData) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_UPDATE_USER'
  })
  const params = {
    TableName: nouriChapters,
    Key: {
      chapterState: partitionKey,
      chapterDocument: sortKey
    },
    ConditionExpression: 'attribute_exists(chapterDocument)',
    ExpressionAttributeValues: {
      ':a': userData.fName,
      ':b': userData.lName,
      ':c': userData.email,
      ':e': userData.phone,
      ':f': userData.familyMembers.person.fname,
      ':g': userData.familyMembers.person.child,
      ':h': userData.address.street,
      ':i': userData.address.street2,
      ':j': userData.address.aptSte,
      ':k': userData.address.city,
      ':l': userData.address.homeState,
      ':m': userData.address.zip,
      ':n': userData.dietaryRestrictions,
      ':o': userData.specialNotes,
      ':p': userData.deliveryDay,
      ':q': userData.deliveryInstructions
    },
    UpdateExpression: `set profile.fName = :a,
      profile.lName = :b,
      profile.email = :c,
      profile.phone = :e,
      profile.familyMembers.person.fname = :f,
      profile.familyMembers.person.child = :g,
      profile.address.street = :h,
      profile.address.street2 = :i,
      profile.address.aptSte = :j,
      profile.address.city = :k,
      profile.address.homeState = :l,
      profile.address.zip = :m,
      profile.dietaryRestrictions = :n,
      profile.specialNotes = :o,
      profile.deliveryDay = :p,
      profile.deliveryInstructions = :q`,
    ReturnValues: 'UPDATED_NEW'
  }
  logInfo('STEP_PARAMS_COMPLETE', params)
  try {
    const updatedUser = await db.update(params).promise()
    logInfo('STEP_UPDATE_DOCUMENT_COMPLETE', updatedUser)
    return updatedUser
  } catch (error) {
    logError('ERROR_UPDATING_DOCUMENT', error)
    return { error }
  };
}
