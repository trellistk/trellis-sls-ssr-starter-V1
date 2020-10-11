'use strict'

const { httpError } = require('../../helpers/response')
const { createDocument, getDocument } = require('../../helpers/db')
const logger = require('../../helpers/logger')

const sequence = {
  START_UPDATE_EMAIL_SEQUENCE: 'START_UPDATE_EMAIL_SEQUENCE',
  STEP_FOUND_AUTH_TOKEN: 'STEP_FOUND_AUTH_TOKEN',
  STEP_FOUND_REQUEST_DATA: 'STEP_FOUND_REQUEST_DATA',
  ERROR_EMAILS_MATCH: 'ERROR_EMAILS_MATCH',
  STEP_GET_USER_DATA: 'STEP_GET_USER_DATA',
  STEP_GET_USER_ERROR: 'STEP_GET_USER_ERROR',
  STEP_DOCUMENT_DATA_COLLECTED: 'STEP_DOCUMENT_DATA_COLLECTED',
  ERROR_USER_EXISTS: 'ERROR_USER_EXISTS',
  ERROR_CREATING_USER: 'ERROR_CREATING_USER',
  STEP_USER_CREATED: 'STEP_USER_CREATED'
}

/**
 * @description Updates a family's email by creating a new user, sending a
 * verification email, and logging out of the old user.
 * @param {*} event
 * @param {*} context
 */
module.exports.updateEmail = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_UPDATE_EMAIL'
  })

  logInfo(sequence.START_UPDATE_EMAIL_SEQUENCE)

  const {
    body,
    requestContext: {
      authorizer: {
        principalId
      }
    }
  } = event

  const [chapter, docSort] = principalId.split('|')

  logAdd('userid', docSort)
  logAdd('chapter', chapter)
  logInfo(sequence.STEP_FOUND_AUTH_TOKEN)

  const oldEmail = docSort.slice(7)

  const { email: newEmail } = JSON.parse(body)

  logInfo(sequence.STEP_FOUND_REQUEST_DATA)

  if (newEmail === oldEmail) {
    logError(sequence.ERROR_EMAILS_MATCH)
    httpError(400, 'New email cannot match old email')
  }

  const { data: user, error: dbGetError } = await getDocument(chapter, docSort)
  if (dbGetError) {
    logError(sequence.STEP_GET_USER_ERROR, 'STEP_GET_USER_ERROR', dbGetError)
    return httpError(500, 'Error trying to retrieve user data')
  }

  const {
    password,
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
  } = user

  const document = {
    chapter,
    docSort: `family:${newEmail}`,
    attributes: {
      email: newEmail,
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
      password
    }
  }

  const { error: dbErr } = await createDocument(document)

  if (dbErr) {
    if (dbErr.message === 'The conditional request failed') {
      logError(sequence.ERROR_USER_EXISTS)
      return httpError(403, sequence.ERROR_USER_EXISTS)
    }
    logError(sequence.ERROR_CREATING_USER, dbErr)
    return httpError(400, sequence.ERROR_CREATING_USER)
  }

  logInfo(sequence.STEP_USER_CREATED, `family:${newEmail}`)
}

// Send a verification email to their new email with a token that has their old primary and sort keys.
// They can't login to the new user until they verify it.
