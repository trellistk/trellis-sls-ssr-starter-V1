'use strict'

const qs = require('querystring')
const db = require('../../helpers/db')
const logger = require('../../helpers/logger')
const emailHelper = require('../../helpers/email')
const getSecret = require('../../helpers/get-secret')
const csrf = require('../../helpers/csrf')
const { render } = require('simple-sls-ssr')

const log = logger('SEQUENCE_RESET_REQUEST')

/**
 * @description Signs up a new user. Does NOT handle admin accounts.
 * @param {*} event
 * @param {*} context
 */
module.exports.resetRequest = async (event, context) => {
  const body = await qs.parse(event.body)
  log.info('STEP_EVENT_BODY_PARSED')

  // Check csrf_token with no session.
  const { error: getSecretErr } = await getSecret('/TrellisServerless/jwtSecretKey/dev')
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

  const objectType = body.objectType
  const email = body.email

  // Check user
  const userSort = `user:${email}`
  const { user, error: getUserError } = await db.getUser(objectType, userSort)

  if (user !== undefined && getUserError === undefined) {
    // send the User an email reset email
    const {
      error: sendResetError
    } = await emailHelper.sendResetEmail({
      name: `${user.fname} ${user.lname}`,
      email: user.email,
      type: 'user',
      objectType: user.objectType
    })

    if (sendResetError) {
    }
    return await render('reset-request-success')
  }

  // TODO check lead/admin info

  // Always return to the same succes page
  return await render('reset-request-success')
}
