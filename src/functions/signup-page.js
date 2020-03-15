'use strict'

const csrf = require('../../helpers/csrf')
const { render, response } = require('simple-sls-ssr')

const logger = require('../../helpers/logger')
const log = logger('SEQUENCE_GET_SIGNUP_PAGE')

/**
 * @description Currently only logs in families. Admin NOT supported
 * @param {*} event
 * @param {*} context
 */
module.exports.signupPage = async (event, context) => {
  const { csrf_token: csrfToken, error: getTokenError } = await csrf.getToken()

  if (getTokenError) {
    log.error('ERROR_GETTING_CSRF_TOKEN', { error: getTokenError })
    return response.http(400, 'LOGIN ERROR')
  }

  return await render('signup', {
    csrf_token: csrfToken
  })
}
