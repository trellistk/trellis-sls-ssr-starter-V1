'use strict'

const test = require('tape')
const offline = require('./test-utils/offline')
const fetch = require('node-fetch')
const { userFactory } = require('./test-utils/data_factories')

test('Happy path Logging a user in', async t => {
  await offline.start()

  await fetch('http://localhost:3000/dev/signup', {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const res2 = await fetch('http://localhost:3000/dev/login', {
    method: 'POST',
    body: JSON.stringify({
      email: userFactory.correct.email,
      password: userFactory.correct.password,
      chapter: userFactory.correct.chapter
    })
  })
  const json = await res2.json()
  const expectedBody = 'User authenticated'

  t.equals(res2.status, 200, 'Returns http 200')
  t.equals(json.message, expectedBody, 'Returns correct response body')

  await offline.stop()
  t.end()
})

test('Should not log in a user with incorrect username', async t => {
  await offline.start()

  await fetch('http://localhost:3000/dev/signup', {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const loginRes = await fetch('http://localhost:3000/dev/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'badusername1',
      password: userFactory.correct.password,
      chapterState: userFactory.correct.chapter
    })
  })
  const json = await loginRes.json()

  t.equals(loginRes.status, 403, 'Returns http 404')
  t.equals(json.error, 'Forbidden', 'Returns correct response body')

  await offline.stop()
  t.end()
})

test('Should not log in a user with incorrect password', async t => {
  await offline.start()

  await fetch('http://localhost:3000/dev/signup', {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const loginRes = await fetch('http://localhost:3000/dev/login', {
    method: 'POST',
    body: JSON.stringify({
      email: userFactory.correct.email,
      password: 'badpassword',
      chapter: userFactory.correct.chapter
    })
  })
  const json = await loginRes.json()

  t.equals(loginRes.status, 403, 'Returns http 404')
  t.equals(json.error, 'Forbidden', 'Returns correct response body')

  await offline.stop()
  t.end()
})
