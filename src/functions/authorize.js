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
  logInfo('STEP_GET_TOKEN')

  if (authorizerArr.length !== 2 ||
      authorizerArr[0] !== 'Bearer' ||
      authorizerArr[1].length === 0) {
    logError('STEP_NO_AUTH', authorizerArr)
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  const { key: jwtSecretKey, error: getSecretErr } = await getSecret('/NouriServerless/jwtSecretKey/dev')
  if (getSecretErr) {
    logError('Error retrieving secret key', getSecretErr)
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  let decoded
  try {
    decoded = jwt.verify(token, jwtSecretKey)
  } catch (error) {
    logError('JWT ERROR', error)
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  const {
    chapter, email
  } = decoded

  logInfo('STEP_DECODE_JWT_COMPLETE')

  const family = `family:${email}`

  const { error: dbError } = await getDocument(chapter, family)

  if (dbError) {
    logError('STEP_DB_ERROR', dbError)
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  const principalId = `${chapter}|family:${email}`

  logInfo('STEP_USER_AUTHORIZED', dbError)
  return generatePolicy(principalId, 'Allow', event.methodArn)
}
