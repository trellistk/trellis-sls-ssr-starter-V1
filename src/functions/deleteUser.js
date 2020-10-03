'use strict'

const { httpResponse, httpError } = require('../../helpers/response')
const { deleteDocument } = require('../../helpers/db')
const logger = require('../../helpers/logger')

const sequence = {
  START_DELETE_USER_SEQUENCE: 'START_DELETE_USER_SEQUENCE',
  ERROR_IS_NOT_ADMIN: 'ERROR_IS_NOT_ADMIN',
  STEP_FOUND_ADMIN: 'STEP_FOUND_ADMIN',
  STEP_FOUND_REQUEST_DATA: 'STEP_FOUND_REQUEST_DATA',
  ERROR_DELETING_USER: 'ERROR_DELETING_USER',
  STEP_DELETE_USER_RESPONSE: 'STEP_DELETE_USER_RESPONSE'
}

/**
 * @description Deletes a user from the database
 * Requires admin permissions
 * @param {*} event
 * @param {*} context
 */

module.exports.deleteUser = async (event, context) => {
  const { logInfo, logError, logAdd } = logger({
    sequence: 'SEQUENCE_DELETE_USER'
  })

  logInfo(sequence.START_DELETE_USER_SEQUENCE)

  const {
    body,
    requestContext: {
      authorizer: {
        principalId
      }
    }
  } = event

  const [adminChapter, docSort] = principalId.split('|')

  if (!docSort.startsWith('admin:')) {
    logError(sequence.ERROR_IS_NOT_ADMIN)
    httpError(403, 'User does not have admin permissions')
  }

  logAdd('userid', docSort)
  logAdd('chapter', adminChapter)
  logInfo(sequence.STEP_FOUND_ADMIN)

  const {
    userChapter,
    email
  } = JSON.parse(body)

  logInfo(sequence.STEP_FOUND_REQUEST_DATA)

  const userDocSort = `family:${email}`

  const {
    info: deleted,
    error: dbError
  } = await deleteDocument(userChapter, userDocSort)
  if (dbError) {
    logError(sequence.ERROR_DELETING_USER, dbError)
    httpError(400, 'Error with deleting user')
  }

  logInfo(sequence.STEP_DELETE_USER_RESPONSE)
  return httpResponse(200, 'User deleted successfully!', deleted)
}
