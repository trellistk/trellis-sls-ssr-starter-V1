'use strict'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { getSecret } = require('../../helpers/getSecret')
const { getChapterDocument } = require('../../helpers/db')
const { httpResponse } = require('../../helpers/response')
const logger = require('../../helpers/logger')

module.exports.login = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_LOGIN_USER'
  })
  logInfo('IS OFFLINE?', process.env.IS_OFFLINE)
  logInfo('START_LOGGING_IN_USER')

  try {
    const { username, password, chapterState } = JSON.parse(event.body)
    logInfo('STEP_PARSED_EVENT_BODY', password)

    const userDocumentSortKey = 'USER#' + username

    const user = await getChapterDocument(chapterState, userDocumentSortKey)
    logInfo('STEP_CHECK_DB_FOR_USER', user)

    if (!user.Item) {
      logError('ERROR_LOGGING_IN_USER', user)
      return httpResponse(404, 'User not found')
    }

    const dbPassword = user.Item.profile.password

    const isMatch = bcrypt.compareSync(password, dbPassword)
    logInfo('STEP_CHECK_IF_PASSWORDS_MATCH', isMatch)
    if (!isMatch) {
      logError('ERROR_LOGGING_IN_USER', isMatch)
      return httpResponse(404, 'Password is incorrect')
    } else {
      const payload = { username: userDocumentSortKey, chapterState }

      const jwtSecretKey = await getSecret('/NouriServerless/jwtSecretKey/dev')

      const token = jwt.sign(payload, jwtSecretKey, { expiresIn: '15m' })

      logInfo('STEP_USER_AUTHENTICATED', token)
      return httpResponse(200, 'User authenticated', token)
    }
  } catch (error) {
    logError('ERROR_LOGGING_IN_USER', error)
    return httpResponse(500, error)
  }
}
