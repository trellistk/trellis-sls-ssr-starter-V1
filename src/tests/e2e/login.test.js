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

test('Happy path Logging a user in', async t => {
  await fetch(`${API_DOMAIN_DEV}/signup`, {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const res2 = await fetch(`${API_DOMAIN_DEV}/login`, {
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

test('Should not log in a user with incorrect username', async t => {
  await fetch(`${API_DOMAIN_DEV}/signup`, {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const loginRes = await fetch(`${API_DOMAIN_DEV}/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'badusername1',
      password: userFactory.correct.password,
      chapter: userFactory.correct.chapter
    })
  })
  const json = await loginRes.json()

  t.equals(loginRes.status, 403, 'Returns http 404')
  t.equals(json.error, 'Forbidden', 'Returns correct response body')

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

test('Should not log in a user with incorrect password', async t => {
  await fetch(`${API_DOMAIN_DEV}/signup`, {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const loginRes = await fetch(`${API_DOMAIN_DEV}/login`, {
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
