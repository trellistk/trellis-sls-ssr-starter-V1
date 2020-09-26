// 'use strict'
// const AWS = require('aws-sdk')
// const db = require('../../database/dynamodb')
// const response = require('../../helpers/response')

// const usersTable = process.env.DYNAMODB_TABLE

// // TODO for admins
// module.exports.deleteUser = (event, context, callback) => {
//   const { city, username } = JSON.parse(event.body) // Change with Slack Integration?

//   const params = {
//     TableName: usersTable,
//     Key: {
//       city: city,
//       username: username
//     },
//     ReturnValues: 'ALL_OLD'
//   }

//   return db.delete(params).promise().then(res => {
//     if (res.Attributes) callback(null, response(200, { message: 'User deleted successfully' }))
//     else callback(null, response(404, { error: 'User not found' }))
//   }).catch(err => callback(null, response(err.statusCode, err)))
// }
