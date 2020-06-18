'use strict';

module.exports.httpResponse = (statusCode, message)=> {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}
