'Use strict'

const jwt = require('jsonwebtoken')
const { generatePolicy } = require('../../helpers/genPolicy')
const { getSecret } = require('../../helpers/getSecret')
const { getChapterDocument } = require('../../helpers/db')
const { httpResponse } = require('../../helpers/response')
const logger = require('../../helpers/logger')

module.exports.authorize = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_AUTHORIZE_USER'
  })
  const authorizerToken = event.authorizationToken
  const authorizerArr = authorizerToken.split(' ')
  const token = authorizerArr[1]
  logInfo('STEP_GET_TOKEN', token)

  try {
  if (authorizerArr.length !== 2 ||
      authorizerArr[0] !== 'Bearer' ||
      authorizerArr[1].length === 0) {
    logError('STEP_NO_AUTH', authorizerArr)
    return generatePolicy('undefined', 'Deny', event.methodArn)
  };

  const jwtSecretKey = await getSecret('/NouriServerless/jwtSecretKey/dev')
  const decodedJwt = jwt.verify(token, jwtSecretKey)
  logInfo('STEP_DECODE_JWT_COMPLETE', decodedJwt)

  const { error: dbError } = await getChapterDocument(decodedJwt.chapterState, decodedJwt.username)

  if (dbError) {
    logError('STEP_DB_ERROR', dbError)
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }
  logInfo('STEP_USER_AUTHORIZED', dbError)
  return generatePolicy(decodedJwt.chapterState, 'Allow', event.methodArn)
  } catch (error) {
    logError('STEP_SERVER_ERROR', error)
    return { error }
  }
}
