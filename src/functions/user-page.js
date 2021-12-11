'use strict'

const { render, response } = require('simple-sls-ssr')
const db = require('../../helpers/db')
const logger = require('../../helpers/logger')
const csrf = require('../../helpers/csrf')
const log = logger('GET_USER_SEQUENCE')

/**
 * @description User dashboard to update their information
 * @param {*} event
 * @param {*} context
 */
module.exports.userPage = async (event, context) => {
  const {
    requestContext: {
      authorizer: {
        principalId
      }
    }
  } = event
  log.info('STEP_PARSED_EVENT_INFORMATION')

  const [objectType, docSort] = principalId.split('|')
  log.info('STEP_FOUND_USER_INFORMATION')

  const { user, error: getUserError } = await db.getUser(objectType, docSort)
  if (getUserError) {
    log.error('ERROR_RETRIEVING_USER_INFO')
    return await render('error', {
      variables: {
        status_code: 400,
        status_message: 'Bad Request',
        details: 'Something went wrong.'
      }
    })
  }
  log.info('STEP_FOUND_USER_RECORD')

  delete user.password

  const { csrf_token: csrfToken, error: getTokenError } = await csrf.getToken()

  if (getTokenError) {
    log.error('ERROR_GETTING_CSRF_TOKEN', { error: getTokenError })
    return response.http(400, 'LOGIN ERROR')
  }

  await db.addCsrf(objectType, docSort, csrfToken)

  log.info('STEP_RENDERING_USER_INFO')
  return await render('user',
    {
      objectType,
      fname: user.fname,
      lname: user.lname,
      csrf_token: csrfToken
    })
}
