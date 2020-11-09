'use strict'

const emailHelper = require('../../helpers/email')
const db = require('../../helpers/db')
const { httpError, httpRedirect } = require('../../helpers/response')
const logger = require('../../helpers/logger')

const sequence = {
  START_VERIFY_EMAIL_SEQUENCE: 'START_VERIFY_EMAIL_SEQUENCE',
  ERROR_VERIFYING_EMAIL: 'ERROR_VERIFYING_EMAIL',
  ERROR_UPDATING_ACCOUNT: 'ERROR_UPDATING_ACCOUNT',
  STEP_EMAIL_VERIFIED: 'STEP_EMAIL_VERIFIED'
}

/**
 * @description Signs up a new family. Does NOT handle admin accounts.
 * @param {*} event
 * @param {*} context
 */
module.exports.verifyEmail = async (event, context) => {
  const {
    pathParameters: {
      token
    }
  } = event

  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_VERIFY_EMAIL'
  })

  logInfo(sequence.START_VERIFY_EMAIL_SEQUENCE)

  const {
    data: verifyEmailData,
    error: verifyEmailError
  } = await emailHelper.verifyEmailToken({
    token
  })

  if (verifyEmailError) {
    // TODO Handle expired token
    logError('ERROR_VERIFYING_EMAIL', verifyEmailError)
    return httpError(400, 'Verification error')
  }

  const {
    email,
    chapter,
    type
  } = verifyEmailData

  logAdd('userid', `${type}:${email}`)
  logAdd('chapter', chapter)

  // Update user's account as verified
  const updateItems = {
    email_verified: true
  }

  const docSort = `${type}:${email}`

  const {
    error: dbError
  } = await db.updateFamilyDocument(chapter, docSort, updateItems)

  if (dbError) {
    console.log(sequence.ERROR_UPDATING_ACCOUNT)
    return httpError(400, 'Error updating account')
  }

  logInfo('STEP_EMAIL_VERIFIED')

  const redirectUrl = `${process.env.FE_DOMAIN}/login`

  return httpRedirect(redirectUrl)
}
