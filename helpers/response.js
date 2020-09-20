'use strict'

module.exports.httpResponse = (statusCode, message, data) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ message, data })
  }
}

module.exports.httpError = (statusCode, message, data) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error: message, data })
  }
}