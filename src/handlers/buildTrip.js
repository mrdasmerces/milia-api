'use strict';

const { ErrorHandler }  = require('../utils/error-handling')
const { success }       = require('../utils/response')
const TripHelper      = require('../helpers/triphelper')

const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  try {
    const requestBody = JSON.parse(event.body);
    const { attractionsPerDay, tripId, city, tripDays } = requestBody;

    const ret = await TripHelper.buildItinerary(attractionsPerDay, tripDays, tripId, city);

    return callback(null, success(ret));

  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }

};

module.exports = { handler };

