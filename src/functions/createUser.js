'use strict'
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

const { httpResponse } = require('../../helpers/response')
const { createItem } = require('../../helpers/db')
const logger = require('../../helpers/logger')

// usage
module.exports.createUser = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_CREATE_USER'
  })
  logInfo('IS OFFLINE?', process.env.IS_OFFLINE)
  logInfo('START_CREATING_NEW_USER')

  try {
    const data = JSON.parse(event.body)
    logInfo('STEP_PARSED_EVENT_BODY', data)

    const user = {
      id: uuidv4(),
      username: data.username,
      password: bcrypt.hashSync(data.password, 10),
      city: data.city,
      deliveryDay: data.deliveryDay
    }

    logAdd('userid', user.id)
    logInfo('STEP_BUILT_USER_DATA', user)
    
    const { data: dbData, error: dbErr } = await createItem(user)
    if (dbErr) {
      logError('ERROR_CREATING_USER', dbErr)
      return httpResponse(400, { error: dbErr })
    }
    logInfo('STEP_CREATED_USER', dbData)
    console.log("newdata", dbData)
    return httpResponse(201, dbData)
  
  } catch (err) {
    logError('ERROR_CREATING_NEW_USER', err)
    return httpResponse(400, { error: err })
  }
}