'use strict'

const bcrypt = require('bcryptjs')
const { httpResponse, httpError } = require('../../helpers/response')
const { updateUserPassword, getDocument } = require('../../helpers/db')
const logger = require('../../helpers/logger')

const sequence = {
  START_UPDATE_PASSWORD_SEQUENCE: 'START_UPDATE_PASSWORD_SEQUENCE',
  STEP_FOUND_USER_AUTH: 'STEP_FOUND_USER_AUTH',
  STEP_FOUND_REQUEST_DATA: 'STEP_FOUND_REQUEST_DATA',
  ERROR_INVALID_NEW_PASSWORD: 'ERROR_INVALID_NEW_PASSWORD',
  ERROR_NEW_PASSWORDS_DONT_MATCH: 'ERROR_NEW_PASSWORDS_DONT_MATCH',
  STEP_RETRIEVED_USER_DATA: 'STEP_RETRIEVED_USER_DATA',
  ERROR_RETRIEVING_USER_DATA: 'ERROR_RETRIEVING_USER_DATA',
  STEP_PASSWORD_COMPARE_RESULT: 'STEP_PASSWORD_COMPARE_RESULT',
  ERROR_PASSWORD_COMPARE_RESULT: 'ERROR_PASSWORD_COMPARE_RESULT',
  ERROR_PASSWORD_VALIDATION: 'ERROR_PASSWORD_VALIDATION',
  ERROR_HASHING_PASSWORD: 'ERROR_HASHING_PASSWORD',
  ERROR_UPDATING_PASSWORD: 'ERROR_UPDATING_PASSWORD',
  STEP_UPDATE_PASSWORD_RESPONSE: 'STEP_UPDATE_PASSWORD_RESPONSE'
}

/**
 * @description Updates a family's login password.
 * @param {*} event
 * @param {*} context
 */
module.exports.updatePassword = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_UPDATE_PASSWORD'
  })

  logInfo(sequence.START_UPDATE_PASSWORD_SEQUENCE)

  const {
    body,
    requestContext: {
      authorizer: {
        principalId
      }
    }
  } = event

  const [chapter, userID] = principalId.split('|')

  logAdd('userid', userID)
  logAdd('chapter', chapter)
  logInfo(sequence.STEP_FOUND_USER_AUTH)

  const {
    oldPassword,
    newPassword1,
    newPassword2
  } = JSON.parse(body)

  logInfo(sequence.STEP_FOUND_REQUEST_DATA)

  if ((newPassword1 === '') || (newPassword1.length < 5)) {
    logError(sequence.ERROR_INVALID_NEW_PASSWORD, newPassword1)
  }

  if (newPassword1 !== newPassword2) {
    logError(sequence.ERROR_NEW_PASSWORDS_DONT_MATCH, `${newPassword1} and ${newPassword2}`)
    return httpError(400, "New passwords don't match")
  }

  const { data: userData, error: dbGetError } = await getDocument(chapter, userID)

  if (dbGetError) {
    logError(sequence.ERROR_RETRIEVING_USER_DATA, dbGetError)
    return httpError(500, 'Error retrieving user data')
  }

  logInfo(sequence.STEP_RETRIEVED_USER_DATA)

  const {
    password: hashedPassword
  } = userData

  try {
    const isMatch = bcrypt.compareSync(oldPassword, hashedPassword)
    logInfo(sequence.STEP_PASSWORD_COMPARE_RESULT, `Match: ${isMatch}`)

    if (!isMatch) {
      logError(sequence.ERROR_PASSWORD_COMPARE_RESULT, `Match: ${isMatch}`)
      return httpError(403, 'Forbidden')
    }
  } catch (e) {
    logError(sequence.ERROR_PASSWORD_VALIDATION, e)
    return httpError(403, 'Forbidden')
  }

  let newHashedPassword
  try {
    newHashedPassword = await bcrypt.hashSync(newPassword1, 10)
  } catch (e) {
    logError(sequence.ERROR_HASHING_PASSWORD, e)
    return httpError(502, 'Hashing Error')
  }

  const updateItem = { password: newHashedPassword }

  const {
    info: updated,
    error: dbUpdateError
  } = await updateUserPassword(chapter, userID, updateItem)
  if (dbUpdateError) {
    logError(sequence.ERROR_UPDATING_PASSWORD, dbUpdateError)
    httpError(500, 'Error with update')
  }

  logInfo(sequence.STEP_UPDATE_PASSWORD_RESPONSE)
  return httpResponse(200, 'User password updated successfully!', updated)
}

// TODO Work on better password validation with @hapi/joi.
