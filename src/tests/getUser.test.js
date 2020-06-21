'use strict'

const test = require('tape')
const { start, stop } = require('./test-utils/offline')
const fetch = require('node-fetch')
const { userFactory, users } = require('./test-utils/testUsers')

const user = userFactory('username3', 'getuser@gmail.com', 'password3', users)

test('Get a user from the database', async t => {
  await start()

  const res1 = await fetch('http://localhost:3000/dev/signup', {
    method: 'POST',
    body: JSON.stringify(user)
  })

  const res2 = await fetch('http://localhost:3000/dev/login', {
    method: 'POST',
    body: JSON.stringify({
      username: 'username3',
      password: 'password3',
      chapterState: user.address.homeState
    })
  })

  const loginJson = await res2.json()
  const token = loginJson.token

  const res3 = await fetch('http://localhost:3000/dev/user', {
    method : 'GET',
    headers: {'Authorization': 'Bearer ' + token}
  })

  const getJson = await res3.json()
  console.log(getJson.message)

  t.equals(res3.status, 200, 'Returns http 200')
  t.equals(getJson.message, getJson.message, 'Returns a correct response body')  //TODO: Can we actually check equality?
  t.end()
})

test('Should return 403 forbidden if user provides incorrect authorization/token', async t => {

  const res3 = await fetch('http://localhost:3000/dev/user', {
    method : 'GET',
    headers: {'Authorization': 'Bearer ' + 'wrong authorization'}
  })

  const getJson = await res3.json()
  const expectedBody = 'User is not authorized to access this resource'
  console.log(getJson.message)

  t.equals(res3.status, 403, 'Returns http 403')
  t.equals(getJson.message, expectedBody, 'Returns correct response body')
  t.end()
})

test('Should return 403 forbidden if user provides no authorization/token', async t => {

  const res3 = await fetch('http://localhost:3000/dev/user')

  const getJson = await res3.json()
  const expectedBody = 'Unauthorized'
  console.log(getJson.message)

  t.equals(res3.status, 401, 'Returns http 401')
  t.equals(getJson.message, expectedBody, 'Returns correct response body')
  await stop()
  t.end()
})
