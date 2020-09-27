'use strict'

const { httpResponse, httpError } = require('../../helpers/response')
const { updateFamilyDocument } = require('../../helpers/db')
const logger = require('../../helpers/logger')

const sequence = {
  START_UPDATE_USER_SEQUENCE: 'START_UPDATE_USER_SEQUENCE',
  STEP_FOUND_USER_DATA: 'STEP_FOUND_USER_DATA',
  STEP_FOUND_REQUEST_DATA: 'STEP_FOUND_REQUEST_DATA',
  ERROR_UPDATING_USER_INFO: 'ERROR_UPDATING_USER_INFO',
  STEP_UPDATE_USER_RESPONSE: 'STEP_UPDATE_USER_RESPONSE'
}

/**
 * @description Updates a family's information excluding
 * email and password
 * @param {*} event
 * @param {*} context
 */
module.exports.updateFamilyDetails = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_UPDATE_USER'
  })

  logInfo(sequence.START_UPDATE_USER_SEQUENCE)

  const {
    body,
    requestContext: {
      authorizer: {
        principalId
      }
    }
  } = event

  const [chapter, docSort] = principalId.split('|')

  logAdd('userid', docSort)
  logAdd('chapter', chapter)
  logInfo(sequence.STEP_FOUND_USER_DATA)

  const {
    fname,
    lname,
    phone,
    street1,
    street2,
    city,
    state,
    zip,
    totalHouseholdIncome,
    communityAlias,
    deliveryNotes
  } = JSON.parse(body)

  logInfo(sequence.STEP_FOUND_REQUEST_DATA)

  const updateItems = {
    fname: fname,
    lname,
    phone,
    street1,
    street2,
    city,
    state,
    zip,
    totalHouseholdIncome,
    communityAlias,
    deliveryNotes
  }

  const {
    info: updated,
    error: dbError
  } = await updateFamilyDocument(chapter, docSort, updateItems)
  if (dbError) {
    logError(sequence.ERROR_UPDATING_USER_INFO, dbError)
    httpError(400, 'Error with Update')
  }

  logInfo(sequence.STEP_UPDATE_USER_RESPONSE)
  return httpResponse(200, 'User updated successfully!', updated)
}
