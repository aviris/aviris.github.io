// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/no-var-requires
const aws = require('aws-sdk')
const ses = new aws.SES({ region: 'us-west-2' })

let emails = []

/*
event = {
  email: string,
  name: string,
  location: string,
  reason: string,
  message: string
}
 */

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.handler = (event, context, callback) => {
  const parsedBody = JSON.parse(event.body)
  const message = `
  From: ${parsedBody.email}
  Name: ${parsedBody.name}
  Location: ${parsedBody.location}
  Reason: ${parsedBody.reason}
  Message: ${parsedBody.message}
  `

  // Feedback on Map goes to different emails
  switch (parsedBody.reason) {
    case 'Suggestions':
      emails.push('map-suggestions@byu.edu')
      break
    case 'Bug':
      emails.push('map-feedback@byu.edu')
      break
    case 'Out of date information.':
      emails.push('map-out-of-date@byu.edu')
      break
  }

  const params = {
    Destination: {
      ToAddresses: emails
    },
    Message: {
      Body: {
        Text: {
          Data: message
        }
      },
      Subject: {
        Data: 'Map Feedback'
      }
    },
    Source: 'map-feedback@byu.edu'
  }

  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.log(err)
      const response = {
        statusCode: 500,
        headers: {},
        body: JSON.stringify(err)
      }
      callback(null, response)
    } else {
      console.log(data)
      const response = {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(data)
      }
      callback(null, response)
    }
  })
}
