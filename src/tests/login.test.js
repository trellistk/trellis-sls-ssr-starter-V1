'use strict'

const test = require('tape')
const { start, stop } = require('./test-utils/offline')
const fetch = require('node-fetch')
const { userFactory, users } = require('./test-utils/testUsers')

const user = userFactory('username2', 'login@gmail.com', 'password2', users)

test('Logging a user in', async t => {
  await start()

  const res1 = await fetch('http://localhost:3000/dev/signup', {
    method: 'POST',
    body: JSON.stringify(user)
  })

  const res2 = await fetch('http://localhost:3000/dev/login', {
    method: 'POST',
    body: JSON.stringify({
      username: 'username2',
      password: 'password2',
      chapterState: user.address.homeState
    })
  })
  const json = await res2.json()
  const expectedBody = 'User authenticated'

  t.equals(res2.status, 200, 'Returns http 200')
  t.equals(json.message, expectedBody, 'Returns correct response body')
  t.end()
})

test('Should not log in a user with incorrect username', async t => {

  const res2 = await fetch('http://localhost:3000/dev/login', {
    method: 'POST',
    body: JSON.stringify({
      username: 'badusername1',
      password: 'password2',
      chapterState: user.address.homeState
    })
  })
  const json = await res2.json()
  const expectedBody = 'User not found'

  t.equals(res2.status, 404, 'Returns http 404')
  t.equals(json.message, expectedBody, 'Returns correct response body')
  t.end()
})

test('Should not log in a user with incorrect password', async t => {

  const res2 = await fetch('http://localhost:3000/dev/login', {
    method: 'POST',
    body: JSON.stringify({
      username: 'username2',
      password: 'badpassword',
      chapterState: user.address.homeState
    })
  })
  const json = await res2.json()
  const expectedBody = 'Password is incorrect'

  t.equals(res2.status, 404, 'Returns http 404')
  t.equals(json.message, expectedBody, 'Returns correct response body')
  await stop()
  t.end()
})
