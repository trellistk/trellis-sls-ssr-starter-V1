'use strict'

require('dotenv').config()

const API_DOMAIN_DEV = process.env.API_DOMAIN_DEV

const test = require('tape')
const AWS = require('aws-sdk')
const fetch = require('node-fetch')
const { userFactory } = require('../test-utils/data_factories')

const dbOptions = {
  region: 'us-west-2'
}
const directDB = new AWS.DynamoDB.DocumentClient(dbOptions)

test('Happy path Get a user from the database', async t => {
  await fetch(`${API_DOMAIN_DEV}/signup`, {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const loginUserRes = await fetch(`${API_DOMAIN_DEV}/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: userFactory.correct.email,
      password: userFactory.correct.password,
      chapter: userFactory.correct.chapter
    })
  })

  const loginJson = await loginUserRes.json()
  const token = loginJson.data

  const getUserRes = await fetch(`${API_DOMAIN_DEV}/family`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })

  const getJson = await getUserRes.json()

  t.equals(getUserRes.status, 200, 'Returns http 200')
  t.equals(getJson.message, getJson.message, 'Returns a correct response body') // TODO: Can we actually check equality?

  const deleteParams = {
    TableName: process.env.TABLE_DEV,
    Key: {
      chapter: userFactory.correct.chapter,
      docSort: `family:${userFactory.correct.email}`
    }
  }
  await directDB.delete(deleteParams).promise()

  t.end()
})

test('Should return 403 forbidden if user provides malformed authorization/token', async t => {
  const getUserRes = await fetch(`${API_DOMAIN_DEV}/family`, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + 'wrongauthorization' }
  })

  const getJson = await getUserRes.json()

  t.equals(getUserRes.status, 403, 'Returns http 403')
  t.equals(getJson.Message, 'User is not authorized to access this resource with an explicit deny', 'Returns correct response body')

  t.end()
})

// TODO test if user provides token from a different user.

test('Should return 403 forbidden if user provides no authorization/token', async t => {
  const res3 = await fetch(`${API_DOMAIN_DEV}/family`)

  const getJson = await res3.json()
  const expectedBody = 'Unauthorized'

  t.equals(res3.status, 401, 'Returns http 401')
  t.equals(getJson.message, expectedBody, 'Returns correct response body')

  t.end()
})
