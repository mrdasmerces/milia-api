'use strict';

const { ErrorHandler }  = require('../../utils/error-handling')
const { success }       = require('../../utils/response')
const DynamoHelper      = require('../../helpers/dynamodb')
const TripHelper      = require('../../helpers/triphelper')

const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  try {
    const ret = {
      actualTrip: false,
      itinerary: false,
    };

    const email = event.queryStringParameters.email;

    const actualTrip = await DynamoHelper.getUserActualTrip(email);
    if(!actualTrip) return callback(null, success(ret));

    ret.actualTrip = actualTrip;

    const itinerary = await DynamoHelper.getTripItinerary(actualTrip.tripId);
    ret.itinerary = itinerary;

    return callback(null, success(ret));
  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }

};

module.exports = { handler };

