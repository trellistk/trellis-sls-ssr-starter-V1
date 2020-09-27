'use strict'

require('dotenv').config()

const API_DOMAIN_LOCAL = process.env.API_DOMAIN_LOCAL

const test = require('tape')
const offline = require('../test-utils/offline')
const fetch = require('node-fetch')
const { userFactory } = require('../test-utils/data_factories')

test('Happy path update a user in the database', async t => {
  await offline.start()

  await fetch(`${API_DOMAIN_LOCAL}/signup`, {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const loginRes = await fetch(`${API_DOMAIN_LOCAL}/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: userFactory.correct.email,
      password: userFactory.correct.password,
      chapter: userFactory.correct.chapter
    })
  })

  const loginJson = await loginRes.json()
  const token = loginJson.data

  const updateRes = await fetch(`${API_DOMAIN_LOCAL}/family`, {
    method: 'PUT',
    headers: { Authorization: 'Bearer ' + token },
    body: JSON.stringify(userFactory.correctUpdate)
  })

  const updatedJson = await updateRes.json()

  t.equals(updateRes.status, 200, 'Returns http 200')
  t.equals(updatedJson.message, 'User updated successfully!', 'Returns a correct response body')
  t.deepEquals(updatedJson.data, userFactory.correctUpdate, 'User info matches the update request.')

  offline.stop()
  t.end()
})

// TODO test if a null or undefined value is passed in
// TODO test for updating less values
// TODO test for updating optional values
