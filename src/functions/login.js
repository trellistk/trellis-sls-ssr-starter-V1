'use strict'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { getSecret } = require('../../helpers/getSecret')
const { getDocument } = require('../../helpers/db')
const { httpResponse, httpError } = require('../../helpers/response')
const logger = require('../../helpers/logger')

const sequence = {
  STEP_LOGIN_PARSED_EVENT_BODY: 'STEP_LOGIN_PARSED_EVENT_BODY',
  ERROR_LOGIN_RETRIEVING_USER_DATA: 'ERROR_LOGIN_RETRIEVING_USER_DATA',
  STEP_LOGIN_RETRIEVED_USER_DATA: 'STEP_LOGIN_RETRIEVED_USER_DATA',
  STEP_LOGIN_COMPARE_RESULT: 'STEP_LOGIN_COMPARE_RESULT',
  ERROR_LOGIN_COMPARE_RESULT: 'ERROR_LOGIN_COMPARE_RESULT',
  ERROR_LOGIN_VALIDATION: 'ERROR_LOGIN_VALIDATION',
  ERROR_LOGIN_SECRET_KEY_RETRIEVAL: 'ERROR_LOGIN_SECRET_KEY_RETRIEVAL',
  STEP_LOGIN_SECRET_KEY_RETRIEVED: 'STEP_LOGIN_SECRET_KEY_RETRIEVED',
  ERROR_LOGIN_JWT_SIGNING: 'ERROR_LOGIN_JWT_SIGNING',
  SUCCESS_LOGIN_USER_AUTHENTICATED: 'SUCCESS_LOGIN_USER_AUTHENTICATED'
}

module.exports.login = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_LOGIN_USER'
  })

  const { email, password, chapter } = JSON.parse(event.body)
    
  const family = `family:${email}`
  logAdd('userid', family)

  logInfo(sequence.STEP_LOGIN_PARSED_EVENT_BODY)

  const { data: userData, error: dbError } = await getDocument(chapter, family)

  if (dbError) {
    logError(sequence.ERROR_LOGIN_RETRIEVING_USER_DATA, dbError)
    return httpError(403, 'Forbidden')
  }
    
  logInfo(sequence.STEP_LOGIN_RETRIEVED_USER_DATA)

  const {
    password: hashedPassword
  } = userData

  try {
    const isMatch = bcrypt.compareSync(password, hashedPassword)
    logInfo(sequence.STEP_LOGIN_COMPARE_RESULT, `Match: ${isMatch}`)
  
    if (!isMatch) {
      logError(sequence.ERROR_LOGIN_COMPARE_RESULT, `Match: ${isMatch}`)
      return httpError(403, 'Forbidden')
    }
  } catch (e) {
    logError(sequence.ERROR_LOGIN_VALIDATION, e)
    return httpError(403, 'Forbidden')
  }

  const payload = { email, chapter }

  const { key: jwtSecretKey, error: getSecretError} = await getSecret('/NouriServerless/jwtSecretKey/dev')

  if (getSecretError) {
    logError(sequence.ERROR_LOGIN_SECRET_KEY_RETRIEVAL, getSecretError)
    return httpError(400, 'LOGIN ERROR')
  }

  logInfo(sequence.STEP_LOGIN_SECRET_KEY_RETRIEVED)

  let token
  try {
    token = jwt.sign(payload, jwtSecretKey, { expiresIn: '15m' })
  } catch (e) {
    logError(sequence.ERROR_LOGIN_JWT_SIGNING, e)
    return httpError(400, 'LOGIN ERROR')
  }

  logInfo(sequence.SUCCESS_LOGIN_USER_AUTHENTICATED, token)
  return httpResponse(200, 'User authenticated', token)
}
