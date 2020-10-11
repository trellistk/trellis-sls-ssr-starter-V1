'use strict'

var aws = require('aws-sdk')

module.exports.sendVerificationEmail = async (recipient) => {
  const sender = 'noreply@teamnouri.org'

  const subject = 'Nouri User Account Verification Email'

  const bodyText = `This email is from Nouri, requesting that you verify your email address
                    in order to access your new account. Upon successful verification, you will be
                    able to log into your new account. If you requested to update your email,
                    all of your account information has been used to create this new account, with
                    the exception of your old email. Please click the following link to verify this
                    address:
                    
                    Some link`

  const bodyHtml = `<html>
                    <head></head>
                    <body>
                      <p>"This email is from Nouri, requesting that you verify your email address
                      in order to access your new account. Upon successful verification, you will be
                      able to log into your new account. If you requested to update your email,
                      all of your account information has been used to create this new account, with
                      the exception of your old email. Please click the following link to verify this
                      address:"
                      
                      <a href='Some Link'</a>
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
        Text: {
          Data: bodyText,
          Charset: charset 
        },
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