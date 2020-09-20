'use strict'

const { httpResponse, httpError } = require('../../helpers/response')
const { createDocument } = require('../../helpers/db')
const logger = require('../../helpers/logger')

sequence = {
  START_GETUSER_SEQUENCE: 'START_GETUSER_SEQUENCE'
}

module.exports.getUser = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_RETRIEVE_USER'
  })

  logInfo(sequence.START_GETUSER_SEQUENCE)

  

  // logInfo('STEP_CHECK_AUTHORIZER', event.requestContext.authorizer)
  // const chapterState = event.requestContext.authorizer.principalId
  // const userDocument = event.requestContext.authorizer.claims.username
  // logInfo('STEP_SET_KEYS', { chapterState, userDocument })

  // const { Item: user, error: dbError } = await getChapterDocument(chapterState, userDocument)
  // logInfo('STEP_GET_USER_COMPLETE', user)

  // if (dbError) {
  //   logError('STEP_GET_USER_ERROR', dbError)
  //   return httpResponse(500, dbError)
  // };
  // logInfo('STEP_USER_RESPONSE')
  // return httpResponse(200, user.profile)
}
