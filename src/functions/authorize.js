'Use strict'

const jwt = require('jsonwebtoken')
const { generatePolicy } = require('../../helpers/genPolicy')
const { getSecret } = require('../../helpers/getSecret')
const { getDocument } = require('../../helpers/db')
const logger = require('../../helpers/logger')

/**
 * @description Middleware for authorizing logins. Currently only
 * supports family logins
 * @param {*} event
 * @param {*} context
 */
module.exports.authorize = async (event, context) => {
  const { logInfo, logError } = logger({
    sequence: 'SEQUENCE_AUTHORIZE_USER'
  })

  const authorizerToken = event.authorizationToken
  const authorizerArr = authorizerToken.split(' ')
  const token = authorizerArr[1]
  logInfo('STEP_GET_TOKEN', token)

  if (authorizerArr.length !== 2 ||
      authorizerArr[0] !== 'Bearer' ||
      authorizerArr[1].length === 0) {
    logError('STEP_NO_AUTH', authorizerArr)
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  const { key: jwtSecretKey, err: getSecretErr } = await getSecret('/NouriServerless/jwtSecretKey/dev')
  if (getSecretErr) {
    logError('Error retrieving secret key', getSecretErr)
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  const {
    email,
    chapter
  } = jwt.verify(token, jwtSecretKey)
  logInfo('STEP_DECODE_JWT_COMPLETE')

  const family = `family:${email}`

  const { error: dbError } = await getDocument(chapter, family)

  if (dbError) {
    logError('STEP_DB_ERROR', dbError)
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  logInfo('STEP_USER_AUTHORIZED', dbError)
  return generatePolicy(chapter, 'Allow', event.methodArn)
}
