'use strict';

const { ErrorHandler }  = require('../../utils/error-handling')
const { success }       = require('../../utils/response')
const { byDateAsc }       = require('../../utils/sort-functions')
const DynamoHelper      = require('../../helpers/dynamodb')

const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  try {
    const email = event.queryStringParameters.email;

    let messages = await DynamoHelper.getUserMessages(email);

    messages = messages ? messages : [];

    if(messages.length) {
      messages = messages.sort(byDateAsc);
      messages.map(m => {
        m.createdAt = new Date(m.createdAt);
        return m;
      })
    } 

    return callback(null, success(messages));

  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }

};

module.exports = { handler };

