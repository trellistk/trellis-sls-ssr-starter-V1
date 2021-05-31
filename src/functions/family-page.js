'use strict'

const { render, response } = require('simple-sls-ssr')
const db = require('../../helpers/db')
const logger = require('../../helpers/logger')
const csrf = require('../../helpers/csrf')
const log = logger('GET_FAMILY_SEQUENCE')

/**
 * @description Family dashboard to update their information
 * @param {*} event
 * @param {*} context
 */
module.exports.familyPage = async (event, context) => {
  const {
    requestContext: {
      authorizer: {
        principalId
      }
    }
  } = event
  log.info('STEP_PARSED_EVENT_INFORMATION')

  const [chapter, docSort] = principalId.split('|')
  log.info('STEP_FOUND_USER_INFORMATION')

  const { family, error: getFamilyError } = await db.getFamily(chapter, docSort)
  if (getFamilyError) {
    log.error('ERROR_RETRIEVING_FAMILY_INFO')
    return await render('error', {
      variables: {
        status_code: 400,
        status_message: 'Bad Request',
        details: 'Something went wrong.'
      }
    })
  }
  log.info('STEP_FOUND_FAMILY_RECORD')

  delete family.password

  const { csrf_token: csrfToken, error: getTokenError } = await csrf.getToken()

  if (getTokenError) {
    log.error('ERROR_GETTING_CSRF_TOKEN', { error: getTokenError })
    return response.http(400, 'LOGIN ERROR')
  }

  await db.addCsrf(chapter, docSort, csrfToken)

  log.info('STEP_RENDERING_FAMILY_INFO')
  return await render('family',
    {
      chapter,
      fname: family.fname,
      lname: family.lname,
      phone: family.phone,
      street1: family.street1,
      street2: family.street2 || '',
      zip: family.zip,
      delivery_notes: family.delivery_notes || '',
      alias: family.alias || '',
      members: family.members,
      member_count: family.member_count,
      kids_who_can_cook_count: family.kids_who_can_cook_count,
      allergies_restrictions: family.allergies_restrictions || '',
      csrf_token: csrfToken
    })
}
