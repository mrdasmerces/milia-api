'use strict';

const { ErrorHandler }  = require('../utils/error-handling')
const { success }       = require('../utils/response')
const DynamoHelper      = require('../helpers/dynamodb')

const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  try {
    const email = event.queryStringParameters.email;

    const trips = await DynamoHelper.getUserTrips(email);
    const messages = await DynamoHelper.getUserMessages(email);
    const timeline = await DynamoHelper.getUserTimeline(email);

    const ret = {
      trips: trips ? trips : [],
      messages: messages ? messages : [],
      timeline: timeline ? timeline : [],
    }

    return callback(null, success(ret));

  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }

};

module.exports = { handler };

