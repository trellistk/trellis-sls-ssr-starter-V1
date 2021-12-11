'use strict'

const qs = require('querystring')

const db = require('../../helpers/db')
const { response, render } = require('simple-sls-ssr')
const logger = require('../../helpers/logger')
const csrf = require('../../helpers/csrf')

const log = logger('UPDATE_USER_INFORMATION')

/**
 * @description Updates a user's information except for
 * email and password.
 * @param {*} event
 * @param {*} context
 */
module.exports.user = async (event, context) => {
  const {
    body,
    headers: {
      Cookie
    },
    requestContext: {
      authorizer: {
        principalId
      }
    }
  } = event
  log.info('STEP_PARSED_EVENT_INFO')

  const [objectType, docSort] = principalId.split('|')
  log.info('STEP_FOUND_USER_INFORMATION')

  const newUserInfo = qs.parse(body)
  log.info('STEP_PARSED_NEW_USER_INFO')

  const sessionToken = Cookie.split('=')[1]
  log.info('STEP_FOUND_SESSION_INFORMATION')

  // Grab user information
  const { user: dbUserInfo } = await db.getUser(objectType, docSort)

  // Check csrf token against session
  if ((dbUserInfo.session !== sessionToken) || (newUserInfo.csrf_token !== dbUserInfo.csrf)) {
    log.error('ERROR_MATCHING_SESSION_AND_CSRF_TOKEN', {
      session: (dbUserInfo.session !== sessionToken),
      csrf: (newUserInfo.csrf_token !== dbUserInfo.csrf),
      page_session: sessionToken,
      db_session: dbUserInfo.session
    })
    return await render('error', {
      status_code: 403,
      status_message: 'Forbidden',
      details: 'Forbidden.'
    })
  }

  log.info('STEP_FOUND_USER_INFORMATION')

  // Check csrf token.
  const { error: csrfVerifyError } = await csrf.verify(newUserInfo.csrf_token)
  if (csrfVerifyError) {
    log.info('ERROR_VERIFYING_CSRF_TOKEN', { error: csrfVerifyError })
    return await render('error', {
      status_code: 403,
      status_message: 'Forbidden',
      details: 'Forbidden.'
    })
  }

  log.error('STEP_CSRF_TOKEN_VERIFIED')

  const userData = {
    objectType: newUserInfo.objectType
  }

  // update User info
  const { error: updateUserError } = await db.updateUser(objectType, docSort, userData)
  if (updateUserError) {
    log.error('ERROR_UPDATING_USER_INFO', { error: updateUserError })
    return await render('error', {
      status_code: 400,
      status_message: 'Bad Request',
      details: 'Something went wrong.'
    })
  }

  log.info('STEP_SUCCESSFULLY_UPDATED_USER_INFO')

  return response.redirect('user', {
    headers: {
      'Access-Control-Allow-Credentials': true
    }
  })
}
