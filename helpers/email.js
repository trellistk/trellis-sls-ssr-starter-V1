const jwt = require('jsonwebtoken')
const SibApiV3Sdk = require('sib-api-v3-sdk')
const defaultClient = SibApiV3Sdk.ApiClient.instance

const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE_KEY

const contactsApi = new SibApiV3Sdk.ContactsApi()
const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()

/**
 * @description Use for marketing purposes.
 * @param {*} email
 */
module.exports.createContact = async ({
  email
}) => {
  const newContact = new SibApiV3Sdk.CreateContact()
  newContact.email = email

  try {
    const res = await contactsApi.createContact(newContact)
    return {
      sib_id: res.id
    }
  } catch (e) {
    console.error('Error creating new contact', e)
    return {
      error: e
    }
  }
}

/**
 * @description Use for marketing purposes
 * @param {*} email
 */
module.exports.deleteContact = async ({
  email
}) => {
  try {
    await contactsApi.deleteContact(email)
  } catch (e) {
    console.error('Error deleting contact', e)
    return {
      error: e
    }
  }
}

/**
 * Helper for generating tokens
 * @param {string} email
 * @param {string} chapter
 * @param {string} type account type like 'family' or 'admin'
 */
const generateToken = async ({
  email,
  chapter,
  type
}) => {
  const payload = {
    email,
    chapter,
    type
  }

  try {
    const token = jwt.sign(
      payload,
      process.env.EMAIL_VERIFICATION_SECRET, { expiresIn: '1d' }
    )

    return token
  } catch (e) {
    console.error('Error creating verification token')
  }
}

/**
 * Sends a verification email to the user
 * @param {string} name The name of the recipient
 * @param {string} email The email of the recipient
 * @param {string} type The account type like 'family' or 'admin'
 * @param {string} chapter
 */
module.exports.sendVerifyEmail = async ({
  name,
  email,
  type,
  chapter
}) => {
  const newEmail = new SibApiV3Sdk.SendSmtpEmail()

  newEmail.subject = 'Thank you for signing up with Nouri'

  newEmail.to = [{
    name,
    email,
    type,
    chapter
  }]

  const token = await generateToken({
    email,
    chapter,
    type
  })
  const url = `${process.env.API_DOMAIN}/verify/${token}`

  newEmail.htmlContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${newEmail.subject}</title>
  </head>
  <body>
    <h2>Hello ${name}!</h2>
  
    <p>Thank you for signing up with Nouri's ${chapter} chapter! Please verify your email by clicking below</p>
    <a href="${url}"><button>Verify</button></a>
    <p>You can also copy this link and paste it in your browser: ${url}</p>
  
    <p>Best,</p>
    <p>Team Nouri</p>
  </body>
  </html>`

  newEmail.sender = {
    name: 'Team Nouri',
    email: 'noreply@teamnouri.org'
  }

  try {
    const res = await transEmailApi.sendTransacEmail(newEmail)
    return {
      sib_msg_id: res.messageId
    }
  } catch (e) {
    console.error('Error sending email', e)
    return {
      error: e
    }
  }
}

/**
 * @description Verify the email verification token
 * @param {string} token
 */
module.exports.verifyEmailToken = async ({
  token
}) => {
  try {
    const {
      email,
      chapter,
      type
    } = await jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET)

    return {
      data: {
        email,
        chapter,
        type
      }
    }
  } catch (error) {
    console.error('Error finding token')
    return { error }
  }
}

/**
 * @description Use for system emails. Not for marketing use.
 * Use to send notifications, password resets, etc.
 * as a response to user request.
 * @param {string} subject Email subject
 * @param  {string} htmlContent Html in string
 * @param {array} emailList Array of objects
 * {
 * name: <receiver's name>
 * email: <receiving email>
 * }
 */
module.exports.sendTransEmail = async ({
  subject,
  htmlContent,
  emailList
}) => {
  const newEmail = new SibApiV3Sdk.SendSmtpEmail()

  newEmail.subject = subject
  newEmail.htmlContent = htmlContent
  newEmail.sender = {
    name: 'Team Nouri',
    email: 'noreply@teamnouri.org'
  }
  newEmail.to = [...emailList]

  try {
    const res = await transEmailApi.sendTransacEmail(newEmail)
    return {
      sib_msg_id: res.messageId
    }
  } catch (e) {
    console.error('Error sending email', e)
    return {
      error: e
    }
  }
}
