const getSecret = require('./get-secret')
const jwt = require('jsonwebtoken')

module.exports.getToken = async () => {
  const { key: jwtSecretKey, error: getSecretError } = await getSecret('/NouriServerless/jwtSecretKey/dev')

  if (getSecretError) {
    return { error: getSecretError }
  }

  try {
    const csrfToken = jwt.sign({}, jwtSecretKey, { expiresIn: '3h', algorithm: 'HS512' })

    return { csrf_token: csrfToken }
  } catch (error) {
    return { error }
  }
}

module.exports.verify = async (token) => {
  const { key: jwtSecretKey, error: getSecretError } = await getSecret('/NouriServerless/jwtSecretKey/dev')

  if (getSecretError) {
    return { error: getSecretError }
  }

  try {
    const verifiedCsrf = jwt.verify(token, jwtSecretKey)
    return { verified: verifiedCsrf }
  } catch (error) {
    return { error }
  }
}
