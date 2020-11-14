'use strict'
const bcrypt = require('bcryptjs')
const { httpResponse, httpError } = require('../../helpers/response')
const { createDocument } = require('../../helpers/db')
const logger = require('../../helpers/logger')
const emailHelper = require('../../helpers/email')

const sequence = {
  START_SIGNUP_SEQUENCE: 'START_SIGNUP_SEQUENCE',
  STEP_EVENT_BODY_PARSED: 'STEP_EVENT_BODY_PARSED',
  ERROR_HASHING_PASSWORD: 'ERROR_HASHING_PASSWORD',
  STEP_PASSWORD_HASHED: 'STEP_PASSWORD_HASHED',
  STEP_DOCUMENT_DATA_COLLECTED: 'STEP_DOCUMENT_DATA_COLLECTED',
  ERROR_USERNAME_EXISTS: 'ERROR_USERNAME_EXISTS',
  ERROR_CREATING_USER: 'ERROR_CREATING_USER',
  SUCCESS_SIGNUP_USER_SEQUENCE: 'SUCCESS_SIGNUP_USER_SEQUENCE'
}

/**
 * @description Signs up a new family. Does NOT handle admin accounts.
 * @param {*} event
 * @param {*} context
 */
module.exports.signUp = async (event, context) => {
  const { logInfo, logError } = logger({
    sequence: 'SEQUENCE_SIGNUP_USER'
  })

  logInfo(sequence.START_SIGNUP_SEQUENCE)

  const {
    password,
    chapter,
    email,
    fname,
    lname,
    phone,
    street1,
    street2,
    city,
    state,
    zip,
    totalHouseholdIncome,
    deliveryNotes,
    communityAlias
  } = JSON.parse(event.body)
  logInfo(sequence.STEP_EVENT_BODY_PARSED)

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(password, 10)
  } catch (e) {
    logError(sequence.ERROR_HASHING_PASSWORD, e)
    return httpError(400, 'Signup Error')
  }

  logInfo(sequence.STEP_PASSWORD_HASHED)

  const document = {
    chapter,
    docSort: `family:${email}`,
    attributes: {
      email,
      fname,
      lname,
      phone,
      street1,
      street2,
      city,
      state,
      zip,
      totalHouseholdIncome,
      deliveryNotes,
      communityAlias,
      password: hashedPassword,
      email_verified: false
    }
  }

  logInfo(sequence.STEP_DOCUMENT_DATA_COLLECTED)

  const { error: dbErr } = await createDocument(document)

  if (dbErr) {
    if (dbErr.message === 'The conditional request failed') {
      logError(sequence.ERROR_USERNAME_EXISTS)
      return httpError(403, sequence.ERROR_USERNAME_EXISTS)
    }
    logError(sequence.ERROR_CREATING_USER, dbErr)
    return httpError(400, sequence.ERROR_CREATING_USER)
  }

  logInfo(sequence.SUCCESS_SIGNUP_USER_SEQUENCE)

  // Send user the verification email
  const {
    error: emailError
  } = await emailHelper.sendVerifyEmail({
    name: `${fname} ${lname}`,
    email,
    type: 'family',
    chapter
  })

  // Just log the error for now
  if (emailError) {
    logError(sequence.ERROR_SENDING_VERIFICATION_EMAIL)
  }

  return httpResponse(201, 'User successfully created!')
}
