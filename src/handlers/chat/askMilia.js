'use strict';

const dialogflow = require('dialogflow');
const uuid = require('uuid');
const moment = require('moment');

const {
  MissingParamsError, 
} = require('../../utils/custom-errors');

const { ErrorHandler }  = require('../../utils/error-handling')
const { success }       = require('../../utils/response')
const DynamoHelper      = require('../../helpers/dynamodb')
const TripHelper      = require('../../helpers/triphelper')

const intentHandlers = require('../intents');
const channels = require('../channels');

const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  try {
    const originChannel = event.queryStringParameters.originChannel;

    const requestBody = JSON.parse(event.body);
    const { queryText, paramsUser } = await channels[originChannel].getParametersRequest(requestBody);
    await channels[originChannel].sendTyping(paramsUser);

    const userId = await channels[originChannel].getUserId(requestBody, event.headers);
    const session = await DynamoHelper.getUserSession(userId);

    let sessionId = '';
    if(session) {
      sessionId = session.sessionId;
    } else {
      sessionId = userId;
    }

    let dialogflowResult = [];

    if (!queryText || !paramsUser) {
      throw new MissingParamsError();
    }
  
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(process.env.DIALOGFLOW_PROJECT_ID, sessionId);
  
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: queryText,
          languageCode: 'pt-BR',
        },
      },
    };
  
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    if (result.intent) {
      if(result.fulfillmentText) {
        if(!session) {

          const newSession = {
            accessToken: sessionId,
            sessionId,
            dynamoContext: JSON.stringify(result),
          };

          await DynamoHelper.setUserSession(newSession);
        } else {
          await DynamoHelper.updateSession(sessionId, JSON.stringify(result));
        }

        dialogflowResult.push({text: result.fulfillmentText});
      } else {
        if(session) await DynamoHelper.deleteUserSession(userId);

        const newMessages = await intentHandlers[result.intent.displayName](result, paramsUser, originChannel);
        dialogflowResult = newMessages;
      }

    } else {
      dialogflowResult.push({text: 'Hum, não entendi, pode repetir por favor? :)'});
    }

    if(paramsUser.email) {
      const actualTrip = await DynamoHelper.getUserActualTrip(paramsUser.email);
      
      if(actualTrip && await TripHelper.isTheCurrentTrip(actualTrip.startTripDate, actualTrip.endTripDate)) {
        paramsUser.tripId = actualTrip.tripId;
      }
    }

    dialogflowResult = dialogflowResult.map(m => ({
      ...m,
      _id: uuid.v4(),
      sessionId,
      createdAt: new Date().toString(),
      user: {
        _id: 2,
        name: 'Milia',
        avatar: 'https://images-milia.s3.amazonaws.com/Webp.net-resizeimage.jpg',
      },
      intent: result.intent ? result.intent.displayName : 'WelcomeIntent',
      email: paramsUser.email,
      tripId: paramsUser.tripId,
    }));

    if(paramsUser.email) {
      const messagesPromises = [DynamoHelper.setNewUserMessage({
        _id: uuid.v4(),
        sessionId,
        createdAt: new Date().toString(),
        user: {
          _id: 1
        },
        text: queryText,
        email: paramsUser.email,
        tripId: paramsUser.tripId,
        intent: result.intent ? result.intent.displayName : 'WelcomeIntent'
      })];

      for(const newMessageMilia of dialogflowResult) {
        messagesPromises.push(DynamoHelper.setNewUserMessage(newMessageMilia));
      }

      await Promise.all(messagesPromises);
    }

    await channels[originChannel].endMessageRequest(dialogflowResult, paramsUser);

    return callback(null, success({ dialogflowResult }));

  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }


};

module.exports = { handler };

