'use strict'

const { httpResponse, httpError } = require('../../helpers/response')
const { getDocument } = require('../../helpers/db')
const logger = require('../../helpers/logger')

const sequence = {
  START_GET_USER_SEQUENCE: 'START_GET_USER_SEQUENCE',
  STEP_GET_USER_AUTHORIZER_DATA_FOUND: 'STEP_GET_USER_AUTHORIZER_DATA_FOUND'
}

/**
 * @description Gets details about one family for the family. Does not support query for admins.
 * @param {*} event 
 * @param {*} context 
 */
module.exports.getFamilyDetails = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_RETRIEVE_USER'
  })

  logInfo(sequence.START_GET_USER_SEQUENCE)

  const {
    requestContext: {
      authorizer: {
        claims: {
          email
        },
        principalId: chapter
      },
    }
  } = event

  
  logInfo(sequence.STEP_GET_USER_AUTHORIZER_DATA_FOUND)

  logAdd('chapter', chapter)
  logAdd('userid', email)

  const family = `family:${email}`

  const { Item: user, error: dbError } = await getDocument(chapter, family)
  logInfo('STEP_GET_USER_COMPLETE', user)

  if (dbError) {
    logError('STEP_GET_USER_ERROR', dbError)
    return httpResponse(500, dbError)
  }

  logInfo('STEP_USER_RESPONSE')
  return httpResponse(200, user)
}