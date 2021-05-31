'use strict'
const AWS = require('aws-sdk')

const ssm = new AWS.SSM()

module.exports = async (secretName) => {
  const params = {
    Name: secretName,
    WithDecryption: true
  }

  try {
    const result = await ssm.getParameter(params).promise()
    return { key: result.Parameter.Value }
  } catch (error) {
    return { error }
  }
}
