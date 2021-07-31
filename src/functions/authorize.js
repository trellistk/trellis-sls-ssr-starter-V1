'Use strict'

const jwt = require('jsonwebtoken')
const generatePolicy = require('../../helpers/gen-policy')
const getSecret = require('../../helpers/get-secret')
const db = require('../../helpers/db')
const logger = require('../../helpers/logger')
const log = logger('SEQUENCE_AUTHORIZE_USER')

/**
 * @description Middleware for authorizing logins. Currently only
 * supports family logins
 * @param {*} event
 * @param {*} context
 */
module.exports.authorize = async (event, context) => {
  const authorizerToken = event.headers.Cookie
  const authorizerArr = authorizerToken.split('=')
  const token = authorizerArr[1]

  log.info('STEP_SESSION_TOKEN_RETRIEVED')

  if (authorizerArr.length !== 2 ||
  authorizerArr[0] !== 'nouri' ||
  authorizerArr[1].length === 0) {
    log.error('STEP_ERROR_TOKEN_FORMATION')
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  const { key: jwtSecretKey, error: getSecretErr } = await getSecret('/NouriServerless/jwtSecretKey/dev')
  if (getSecretErr) {
    log.error('ERROR_RETRIEVING_SECRET', { error: getSecretErr })
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  let decoded
  try {
    decoded = jwt.verify(token, jwtSecretKey)
  } catch (error) {
    log.error('ERROR_VERIFYING_TOKEN', { error })
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  log.info('STEP_TOKEN_VERIFIED')

  const {
    chapter, email
  } = decoded

  log.info('STEP_TOKEN_DECODED')

  const docSort = `family:${email}`

  const { error: dbError } = await db.getFamily(chapter, docSort)
  if (dbError) {
    log.error('ERROR_RETRIEVING_FAMILY_INFO', { error: dbError })
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  const principalId = `${chapter}|family:${email}`

  log.info('STEP_USER_AUTORIZED')
  return generatePolicy(principalId, 'Allow', event.methodArn)
}
