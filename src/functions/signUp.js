'use strict'

const qs = require('querystring')
const db = require('../../helpers/db')
const logger = require('../../helpers/logger')
const emailHelper = require('../../helpers/email')
const getSecret = require('../../helpers/get-secret')
const csrf = require('../../helpers/csrf')
const { render } = require('simple-sls-ssr')

const log = logger('SEQUENCE_SIGNUP_USER')

/**
 * @description Signs up a new family. Does NOT handle admin accounts.
 * @param {*} event
 * @param {*} context
 */
module.exports.signup = async (event, context) => {
  const body = await qs.parse(event.body)
  log.info('STEP_EVENT_BODY_PARSED')

  // Check csrf_token with no session.
  const { error: getSecretErr } = await getSecret('/NouriServerless/jwtSecretKey/dev')
  if (getSecretErr) {
    log.error('ERROR_RETRIEVING_SECRET_KEY', { error: getSecretErr })

    return await render('error', {
      status_code: 403,
      status_message: 'Forbidden',
      details: 'Something went wrong.'
    })
  }

  log.info('STEP_SECRET_KEY_RETRIEVED')

  const { error: csrfError } = await csrf.verify(body.csrf_token)

  if (csrfError) {
    log.error('ERROR_VERIFYING_CSRF_TOKEN', { error: csrfError })
    return await render('error', {
      status_code: 400,
      status_message: 'Forbidden',
      details: 'Something went wrong.'
    })
  }

  log.info('STEP_DECODE_JWT_COMPLETE')

  const { error: dbErr } = await db.signUpFamily(body)

  if (dbErr) {
    if (dbErr.message === 'The conditional request failed') {
      log.error('ERROR_USERNAME_EXISTS')
      return await render('error', {
        status_code: 403,
        status_message: 'Forbidden',
        details: 'Something went wrong.'
      })
    }
    log.error('ERROR_CREATING_USER', { error: dbErr })
    return await render('error', {
      status_code: 400,
      status_message: 'Forbidden',
      details: 'Something went wrong.'
    })
  }

  log.info('SUCCESS_SIGNUP_USER_SEQUENCE')

  // Send user the verification email
  const {
    error: emailError
  } = await emailHelper.sendVerifyEmail({
    name: `${body.fname} ${body.lname}`,
    email: body.email,
    type: 'family',
    chapter: body.chapter
  })

  // Just log the error for now
  if (emailError) {
    log.info('ERROR_SENDING_VERIFICATION_EMAIL', { error: emailError })
  }

  log.info('STEP_EMAIL_SIGNUP_SUCCESS')

  // Return a success page
  return await render('signup-success', {
    fname: body.fname
  })
}
