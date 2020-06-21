'use strict'

const { httpResponse } = require('../../helpers/response')
const { updateUserDocument } = require('../../helpers/db')
const logger = require('../../helpers/logger')

module.exports.updateUser = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_UPDATE_USER'
  })
  try {
    const data = JSON.parse(event.body)
    logInfo('STEP_PARSED_EVENT_BODY', data)

    const chapterState = event.requestContext.authorizer.principalId
    const userDocument = event.requestContext.authorizer.claims.username
    logInfo('STEP_SET_KEYS', { chapterState, userDocument })

    const { Attributes: updates, error: dbError } = await updateUserDocument(chapterState, userDocument, data)
    logInfo('STEP_UPDATE_USER_COMPLETE', updates)

    if (dbError) {
      logError('STEP_UPDATE_USER_ERROR', dbError)
      return httpResponse(400, dbError)
    };
    logInfo('STEP_UPDATE_USER_RESPONSE', updates)
    return httpResponse(200, 'User updated successfully!')
  } catch (error) {
    return { error }
  };
}
