'use strict'

const test = require('tape')
const offline = require('./test-utils/offline')
const fetch = require('node-fetch')
const { userFactory } = require('./test-utils/testUsers')


test('Happy path signing up a new user', async t => {
  await offline.start()

  const res = await fetch('http://localhost:3000/dev/signup', {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })
  const json = await res.json()
  const expectedBody = 'User successfully created!'

  t.equals(res.status, 201, 'Returns http 201')
  t.equals(json.message, expectedBody, 'Returns correct response body')

  await offline.stop()
  t.end()
})

test('Should not allow signup with non-unique username', async t => {
  await offline.start()

  const res = await fetch('http://localhost:3000/dev/signup', {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const res2 = await fetch('http://localhost:3000/dev/signup', {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const json = await res2.json()
  console.log('***** json', json)
  const expectedMessage = 'ERROR_USERNAME_EXISTS'

  t.equals(res2.status, 403, 'Returns http 403')
  t.equals(json.error, expectedMessage, 'Returns correct response body')

  await offline.stop()
  t.end()
})

// TODO Test missing required inputs
// TODO Test incorrectly formatted values