'use strict'

require('dotenv').config()
const test = require('tape')

const sib = require('../../../helpers/email')

test('Happy create contact', async t => {
  const email = 'noreply@teamnouri.org'
  const {
    sib_id: subId,
    error
  } = await sib.createContact({
    email
  })

  if (error) {
    t.fail(`Error creating contact: ${error}`)
  }

  t.equals(typeof subId, 'number')

  // Cleanup
  await sib.deleteContact({ email })
  t.end()
})

test('Happy send email', async t => {
  const contact = {
    email: 'noreply@teamnouri.org',
    name: 'amber'
  }
  const res = await sib.sendTransEmail({
    subject: 'Test email',
    htmlContent: 'hi',
    emailList: [contact]
  })

  t.equals(typeof res.sib_msg_id, 'string')
  t.true(res.sib_msg_id.includes('smtp-relay.mailin.fr'))
  t.end()
})

test('Happy send verification email', async t => {
  const email = 'ambergkim@gmail.com'
  const name = 'amber'

  const res = await sib.sendVerifyEmail({
    email, name
  })

  t.equals(typeof res.sib_msg_id, 'string')
  t.true(res.sib_msg_id.includes('smtp-relay.mailin.fr'))
  t.end()
})
