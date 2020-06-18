'use strict'
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

const { httpResponse } = require('../../helpers/response')
const { createItem } = require('../../helpers/db')

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
    
    const { data: dbData, err: dbErr } = await createItem(user)
    if (dbErr) {
      console.error('ERROR_CREATING_USER', dbErr)
      return httpResponse(400, { error: dbErr })
    }

    console.error('STEP_CREATED_USER', dbData)
    return httpResponse(201, dbData)
  
  } catch (err) {
    console.error('ERROR_CREATING_NEW_USER', err)
    return httpResponse(400, { error: err })
  }
}