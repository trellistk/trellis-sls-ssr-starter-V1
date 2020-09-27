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

test('Happy path update a user in the database', async t => {
  await fetch(`${API_DOMAIN_DEV}/signup`, {
    method: 'POST',
    body: JSON.stringify(userFactory.correct)
  })

  const loginRes = await fetch(`${API_DOMAIN_DEV}/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: userFactory.correct.email,
      password: userFactory.correct.password,
      chapter: userFactory.correct.chapter
    })
  })

  const loginJson = await loginRes.json()
  const token = loginJson.data

  const updateRes = await fetch(`${API_DOMAIN_DEV}/family`, {
    method: 'PUT',
    headers: { Authorization: 'Bearer ' + token },
    body: JSON.stringify(userFactory.correctUpdate)
  })

  const updatedJson = await updateRes.json()

  t.equals(updateRes.status, 200, 'Returns http 200')
  t.equals(updatedJson.message, 'User updated successfully!', 'Returns a correct response body')
  t.deepEquals(updatedJson.data, userFactory.correctUpdate, 'User info matches the update request.')

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

// TODO test if a null or undefined value is passed in
// TODO test for updating less values
// TODO test for updating optional values
