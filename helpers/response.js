'use strict';

module.exports.response = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}