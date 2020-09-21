'use strict'

/**
 * @description Formats the http response for the http functions.
 * Non errors.
 * @param {integer} statusCode 
 * @param {string} message 
 * @param {object} data 
 */
module.exports.httpResponse = (statusCode, message, data) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ message, data })
  }
}

/**
 * @description Formats the http error responses for http functions.
 * @param {integer} statusCode 
 * @param {string} message 
 * @param {object} data 
 */
module.exports.httpError = (statusCode, message, data) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error: message, data })
  }
}