'use strict'
const AWS = require('aws-sdk')

const ssm = new AWS.SSM()

module.exports.getSecret = async (secretName) => {
  const params = {
    Name: secretName,
    WithDecryption: true
  }

  const result = await ssm.getParameter(params).promise()
  return result.Parameter.Value
}
