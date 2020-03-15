'use strict'

const twilioSid = process.env.TWILIO_SID
const twilioToken = process.env.TWILIO_TOKEN

let arc = require('@architect/functions')

const twilio = require('twilio')(twilioSid, twilioToken)
const MessagingResponse = require('twilio').twiml.MessagingResponse

const receiveMessage = async req => {
  const twiml = new MessagingResponse();
  const fromNumber = req.body.From
  console.log('*** fromNumber', fromNumber)
  const fromMessage = req.body.Body
  console.log('*** fromMessage', fromMessage)
  console.log('*** request body', req.body)
  twiml.message(`Hi. Received your message "${fromMessage}" from phone number ${fromNumber}`)
  return {
    headers: {'content-type': 'text/html; charset=utf8'},
    body: twiml.toString()
  }
}

exports.handler = arc.http.async(receiveMessage)