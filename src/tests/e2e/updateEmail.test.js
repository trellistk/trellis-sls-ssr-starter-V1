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

test('Happy path updating a user email', async t => {
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

  const res = await fetch(`${API_DOMAIN_DEV}/update/email`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: JSON.stringify({
      email: userFactory.emailUpdate.newEmail
    })
  })

  const json = await res.json()
  const expectedBody = 'User email successfully updated!'

  t.equals(res.status, 201, 'Returns http 201')
  t.equals(json.message, expectedBody, 'Returns correct response body')

  const deleteParams = {
    TableName: process.env.TABLE_DEV,
    Key: {
      chapter: userFactory.correct.chapter,
      docSort: `family:${userFactory.correct.email}`
    }
  }
  const deleteParams2 = {
    TableName: process.env.TABLE_DEV,
    Key: {
      chapter: userFactory.correct.chapter,
      docSort: `family:${userFactory.emailUpdate.newEmail}`
    }
  }
  await directDB.delete(deleteParams).promise()
  await directDB.delete(deleteParams2).promise()

  t.end()
})

test('Should not allow email update with current email', async t => {
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

  const res = await fetch(`${API_DOMAIN_DEV}/update/email`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: JSON.stringify({
      email: userFactory.correct.email
    })
  })

  const json = await res.json()
  const expectedBody = 'New email cannot match old email'

  t.equals(res.status, 400, 'Returns http 400')
  t.equals(json.error, expectedBody, 'Returns correct response body')

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

test('Should not allow email update with non-unique new email', async t => {
  await fetch(`${API_DOMAIN_DEV}/signup`, {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  await fetch(`${API_DOMAIN_DEV}/signup`, {
    method: 'POST',
    body: JSON.stringify(userFactory.correct2)
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

  const res = await fetch(`${API_DOMAIN_DEV}/update/email`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: JSON.stringify({
      email: userFactory.correct2.email
    })
  })

  const json = await res.json()
  const expectedBody = 'ERROR_USER_EXISTS'

  t.equals(res.status, 403, 'Returns http 403')
  t.equals(json.error, expectedBody, 'Returns correct response body')

  const deleteParams = {
    TableName: process.env.TABLE_DEV,
    Key: {
      chapter: userFactory.correct.chapter,
      docSort: `family:${userFactory.correct.email}`
    }
  }
  const deleteParams2 = {
    TableName: process.env.TABLE_DEV,
    Key: {
      chapter: userFactory.correct.chapter,
      docSort: `family:${userFactory.correct2.email}`
    }
  }
  await directDB.delete(deleteParams).promise()
  await directDB.delete(deleteParams2).promise()

  t.end()
})
