'use strict'

const test = require('tape')
const { start, stop } = require('./test-utils/offline')
const fetch = require('node-fetch')

test('Happy path test creating a new user', async t => {
  await start()

  const res = await fetch('http://localhost:3000/dev/user', {
    method: 'POST',
    body: JSON.stringify({
      username: 'hello',
      password: '123456789'
    })
  })
  
  const json = await res.json()

  const expectedBody = {
    username: 'jane'
  }

  t.equals(res.status, 200, 'Returns http 200')
  t.equals(json.body, expectedBody, 'Returns correct response body')
  await stop()
  t.end()
})