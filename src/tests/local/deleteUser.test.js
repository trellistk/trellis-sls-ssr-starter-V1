// 'use strict'

// require('dotenv').config()

// const API_DOMAIN_LOCAL = process.env.API_DOMAIN_LOCAL

// const test = require('tape')
// const offline = require('../test-utils/offline')
// const fetch = require('node-fetch')
// const { userFactory } = require('../test-utils/data_factories')

// test('Delete a user from the database', async t => {
//   await offline.start()

//   await fetch(`${API_DOMAIN_LOCAL}/signup`, {
//     method: 'POST',
//     body: JSON.stringify(userFactory.correct)
//   })

//   const loginUserRes = await fetch(`${API_DOMAIN_LOCAL}/login`, {
//     method: 'POST',
//     body: JSON.stringify({
//       email: userFactory.correct.email,
//       password: userFactory.correct.password,
//       chapter: userFactory.correct.chapter
//     })
//   })

//   const loginJson = await loginUserRes.json()
//   const token = loginJson.data

//   const getUserRes = await fetch(`${API_DOMAIN_LOCAL}/family`, {
//     method: 'GET',
//     headers: { Authorization: 'Bearer ' + token }
//   })

//   const getJson = await getUserRes.json()

//   t.equals(getUserRes.status, 200, 'Returns http 200')
//   t.equals(getJson.message, getJson.message, 'Returns a correct response body')

//   await offline.stop()
//   t.end()
// })
