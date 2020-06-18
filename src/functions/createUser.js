'use strict'
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

const { httpResponse } = require('../../helpers/response')
const { createItem } = require('../../helpers/db')

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

    const user = {
      id: uuidv4(),
      username: data.username,
      password: bcrypt.hashSync(data.password, 10),
      city: data.city,
      deliveryDay: data.deliveryDay
    }

    console.info('STEP_BUILT_USER_DATE', user)
    
    const { data, err: dbErr } = await createItem(user)
    if (dbErr) {
      console.error('ERROR_CREATING_USER', dbErr)
      return httpResponse(400, { error: dbErr })
    }

    return httpResponse(201, response)
  
  } catch (err) {
    console.error('ERROR_CREATING_NEW_USER', err)
    return httpResponse(400, { error: err })
  }
}