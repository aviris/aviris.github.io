const AWS = require('aws-sdk')
const ssm = new AWS.SSM()
const wso2 = require('byu-wso2-request')

exports.handler = async function (event, context) {
  if (event.path === '/health') {
    return {
      isBase64Encoded: false,
      statusCode: 200,
      statusDescription: '200 OK',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'healthy'
    }
  } else if (event.path === '/') {
    const clientIdParam = await ssm.getParameter({
      Name: process.env.CLIENT_ID_PARAM_NAME,
      WithDecryption: false
    }).promise()
    const clientSecretParam = await ssm.getParameter({
      Name: process.env.CLIENT_SECRET_PARAM_NAME,
      WithDecryption: true
    }).promise()

    await wso2.setOauthSettings(clientIdParam.Parameter.Value, clientSecretParam.Parameter.Value)

    try {
      const response = await wso2.request({
        url: 'https://api.byu.edu:443/domains/aed/1.0.0/get-locations',
        simple: false,
        resolveWithFullResponse: true
      })

      return {
        isBase64Encoded: false,
        statusCode: response.statusCode,
        statusDescription: response.statusDescription,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(response.body)
      }
    } catch (err) {
      return {
        isBase64Encoded: false,
        statusCode: 500,
        statusDescription: 'Internal Server Error',
        headers: {},
        body: 'Error trying to make API call to AED API'
      }
    }
  } else {
    return {
      isBase64Encoded: false,
      statusCode: 404,
      statusDescription: '404 Not Found',
      headers: {},
      body: ''
    }
  }
}

// for local dev
// async function test() {
//   const response = await exports.handler({
//     path: '/'
//   }, {})
//   console.log(response)
// }
//
// test()
