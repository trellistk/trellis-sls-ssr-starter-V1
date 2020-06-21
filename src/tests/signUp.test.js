'use strict'

const test = require('tape')
const { start, stop } = require('./test-utils/offline')
const fetch = require('node-fetch')
const { userFactory, users } = require('./test-utils/testUsers')

const user = userFactory('username1', 'signup@gmail.com', 'password1', users)

test('Signing up a new user', async t => {
  await start()

  const res = await fetch('http://localhost:3000/dev/signup', {
    method: 'POST',
    body: JSON.stringify(user)
  })
  const json = await res.json()
  const expectedBody = 'User successfully created!'

  t.equals(res.status, 201, 'Returns http 201')
  t.equals(json.message, expectedBody, 'Returns correct response body')
  t.end()
})

test('Should not allow signup with non-unique username', async t => {
  const res = await fetch('http://localhost:3000/dev/signup', {
    method: 'POST',
    body: JSON.stringify(user)
  })
  const json = await res.json()
  const expectedMessage = 'This username already exists.'

  t.equals(res.status, 403, 'Returns http 403')
  t.equals(json.message, expectedMessage, 'Returns correct response body')
  await stop()
  t.end()
})
