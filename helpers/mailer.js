'use strict'

var aws = require('aws-sdk')
const jwt = require('jsonwebtoken')
const { getSecret } = require('../../helpers/getSecret')

module.exports.sendVerificationEmail = async (recipient) => {
  const { token } = await createToken(recipient)

  const sender = 'noreply@teamnouri.org'

  const subject = 'Nouri User Account Verification Email'

  const bodyHtml = `<html>
                    <head></head>
                    <body>
                      <p>"This email is from Nouri, requesting that you verify your email address
                      in order to access your new account. Upon successful verification, you will be
                      able to log into your new account. If you requested to update your email,
                      all of your account information has been used to create this new account, with
                      the exception of your old email. Please click the following link to verify this
                      address:"
                      
                      <a href=https://nourimeals.org/verify/${token}</a>
                      </p>
                    </body>
                    </html>`

  const charset = 'UTF-8'

  var ses = new aws.SES()

  var params = { 
    Source: sender, 
    Destination: { 
      ToAddresses: [
        recipient 
      ],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: charset
      },
      Body: {
        Html: {
          Data: bodyHtml,
          Charset: charset
        }
      }
    }
  }

  try {
    const { MessageId } = await ses.sendEmail(params).promise()
    return { MessageId }
  } catch (error) {
    return { error }
  }
}

function createToken(recipient) {
  const payload = { recipient }

  const { key: jwtSecretKey, error: getSecretError } = await getSecret('/NouriServerless/jwtSecretKey/dev')

  if (getSecretError) {
    return { getSecretError }
  }

  let token
  try {
    token = jwt.sign(payload, jwtSecretKey, { expiresIn: '15m' })
  } catch (error) {
    return { error }
  }

  return { token }
}