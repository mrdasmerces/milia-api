'use strict';

const { ErrorHandler }  = require('../utils/error-handling')
const { success, permissionDenied }       = require('../utils/response')

const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  try {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = 'ask-milia-webhook';
      
    // Parse the query params
    let mode = event.queryStringParameters['hub.mode'];
    let token = event.queryStringParameters['hub.verify_token'];
    let challenge = event.queryStringParameters['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        return callback(null, success({ challenge }));
      }

      return callback(null, permissionDenied(challenge));
    }

  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }


};

module.exports = { handler };

