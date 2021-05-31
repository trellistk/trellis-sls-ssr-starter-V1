'use strict'

const qs = require('querystring')

const db = require('../../helpers/db')
const { response, render } = require('simple-sls-ssr')
const logger = require('../../helpers/logger')
const csrf = require('../../helpers/csrf')

const log = logger('UPDATE_FAMILY_INFORMATION')

/**
 * @description Updates a family's information except for
 * email and password.
 * @param {*} event
 * @param {*} context
 */
module.exports.family = async (event, context) => {
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

  const [chapter, docSort] = principalId.split('|')
  log.info('STEP_FOUND_USER_INFORMATION')

  const newFamilyInfo = qs.parse(body)
  log.info('STEP_PARSED_NEW_FAMILY_INFO')

  const sessionToken = Cookie.split('=')[1]
  log.info('STEP_FOUND_SESSION_INFORMATION')

  // Grab family information
  const { family: dbFamilyInfo } = await db.getFamily(chapter, docSort)

  // Check csrf token against session
  if ((dbFamilyInfo.session !== sessionToken) || (newFamilyInfo.csrf_token !== dbFamilyInfo.csrf)) {
    log.error('ERROR_MATCHING_SESSION_AND_CSRF_TOKEN', {
      session: (dbFamilyInfo.session !== sessionToken),
      csrf: (newFamilyInfo.csrf_token !== dbFamilyInfo.csrf),
      page_session: sessionToken,
      db_session: dbFamilyInfo.session
    })
    return await render('error', {
      status_code: 403,
      status_message: 'Forbidden',
      details: 'Forbidden.'
    })
  }

  log.info('STEP_FOUND_USER_INFORMATION')

  // Check csrf token.
  const { error: csrfVerifyError } = await csrf.verify(newFamilyInfo.csrf_token)
  if (csrfVerifyError) {
    log.info('ERROR_VERIFYING_CSRF_TOKEN', { error: csrfVerifyError })
    return await render('error', {
      status_code: 403,
      status_message: 'Forbidden',
      details: 'Forbidden.'
    })
  }

  log.error('STEP_CSRF_TOKEN_VERIFIED')

  const familyData = {
    fname: newFamilyInfo.fname,
    lname: newFamilyInfo.lname,
    phone: newFamilyInfo.phone,
    chapter: newFamilyInfo.chapter,
    street1: newFamilyInfo.street1,
    street2: newFamilyInfo.street2,
    city: newFamilyInfo.city,
    state: newFamilyInfo.state,
    zip: newFamilyInfo.zip,
    alias: newFamilyInfo.alias,
    members: newFamilyInfo.members,
    member_count: newFamilyInfo.member_count,
    kids_who_can_cook_count: newFamilyInfo.kids_who_can_cook_count,
    allergies_restrictions: newFamilyInfo.allergies_restrictions,
    income: newFamilyInfo.income
  }

  // update family info
  const { error: updateFamilyError } = await db.updateFamily(chapter, docSort, familyData)
  if (updateFamilyError) {
    log.error('ERROR_UPDATING_FAMILY_INFO', { error: updateFamilyError })
    return await render('error', {
      status_code: 400,
      status_message: 'Bad Request',
      details: 'Something went wrong.'
    })
  }

  log.info('STEP_SUCCESSFULLY_UPDATED_FAMILY_INFO')

  return response.redirect('family', {
    headers: {
      'Access-Control-Allow-Credentials': true
    }
  })
}
