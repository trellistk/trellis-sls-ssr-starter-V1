'use strict'

const { httpResponse } = require('../../helpers/response')
const { getChapterDocument } = require('../../helpers/db')
const logger = require('../../helpers/logger')

module.exports.getUser = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_RETRIEVE_USER'
  })
  try {
    logInfo('STEP_CHECK_AUTHORIZER', event.requestContext.authorizer)
    const chapterState = event.requestContext.authorizer.principalId
    const userDocument = event.requestContext.authorizer.claims.username
    logInfo('STEP_SET_KEYS', { chapterState, userDocument })

    const { Item: user, error: dbError } = await getChapterDocument(chapterState, userDocument)
    logInfo('STEP_GET_USER_COMPLETE', user)

    if (dbError) {
      logError('STEP_GET_USER_ERROR', dbError)
      return httpResponse(500, dbError)
    };
    logInfo('STEP_USER_RESPONSE')
    return httpResponse(200, user.profile)
  } catch (error) {
    logError('STEP_GET_USER_ERROR', error)
    return { error }
  };
}
