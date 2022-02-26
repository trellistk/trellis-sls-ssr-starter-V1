'use strict'

const { render } = require('simple-sls-ssr')

module.exports.index = async (event, context) => {
  return await render('index', {})
}
