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

test('Happy path signing up a new user', async t => {
  const fetchUrl = `${API_DOMAIN_DEV}/signup`

  const res = await fetch(fetchUrl, {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify(userFactory.correct)
  })

  const json = await res.json()
  const expectedBody = 'User successfully created!'

  t.equals(res.status, 201, 'Returns http 201')
  t.equals(json.message, expectedBody, 'Returns correct response body')

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

test('Should not allow signup with non-unique username', async t => {
  await fetch(`${API_DOMAIN_DEV}/signup`, {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const res2 = await fetch(`${API_DOMAIN_DEV}/signup`, {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const json = await res2.json()

  const expectedMessage = 'ERROR_USERNAME_EXISTS'

  t.equals(res2.status, 403, 'Returns http 403')
  t.equals(json.error, expectedMessage, 'Returns correct response body')

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

// TODO Test missing required inputs
// TODO Test incorrectly formatted values
