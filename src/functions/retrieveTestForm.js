'use strict';

module.exports.retrieveTestForm = async (event, context) => {
  console.log('Event data', event)

  const response = {
    options: [
      {
        text: {
          type: "plain_text",
          text: "*this is plain_text text*"
        },
        value: "value-0"
      },
      {
        text: {
          type: "plain_text",
          text: "*this is plain_text text*"
        },
        value: "value-1"
      },
      {
        text: {
          type: "plain_text",
          text: "*this is plain_text text*"
        },
        value: "value-2"
      }
    ]
  }

  const returnBody = JSON.stringify(response)
  console.log('return body', returnBody)
  return {
    statusCode: 200,
    body: returnBody
  }
}