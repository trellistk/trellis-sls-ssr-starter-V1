'use strict'

const { response } = require('simple-sls-ssr')

/**
 * @description Currently only logs in families. Admin NOT supported
 * @param {*} event
 * @param {*} context
 */
module.exports.logout = async (event, context) => {
  const pastDate = 'Thu, 01 Jan 1970 00:00:00 UTC;'
  return response.redirect('login', {
    'Set-Cookie': `trellis=; expires=${pastDate}`
  })
}
