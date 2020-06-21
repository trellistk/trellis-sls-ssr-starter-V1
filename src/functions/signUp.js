'use strict'
const bcrypt = require('bcryptjs')
const { httpResponse } = require('../../helpers/response')
const { createChapterDocument } = require('../../helpers/db')
const logger = require('../../helpers/logger')

module.exports.signUp = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_SIGNUP_USER'
  })
  const document = {}
  try {
    const data = JSON.parse(event.body)
    logInfo('STEP_EVENT_BODY_PARSED', data)

    data.password = bcrypt.hashSync(data.password, 10)
    logInfo('STEP_PASSWORD_HASHED', data.password)

    document.chapterState = data.address.homeState
    document.chapterDocument = 'USER#' + data.username
    document.profile = data
    logInfo('STEP_DOCUMENT_SET', document)

    const { error: dbErr } = await createChapterDocument(document)
    if (dbErr) {
      if (dbErr.message == 'The conditional request failed') {
        return httpResponse(403, 'This username already exists.')
      };
      return httpResponse(400, { error: dbErr })
    };
    return httpResponse(201, 'User successfully created!')
  } catch (error) {
    return httpResponse(500, { error })
  };
}
