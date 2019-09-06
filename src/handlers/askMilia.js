'use strict';

const dialogflow = require('dialogflow');
const uuid = require('uuid');

const {
  MissingParamsError, 
} = require('../utils/custom-errors');

const { ErrorHandler }  = require('../utils/error-handling')
const { success }       = require('../utils/response')
const DynamoHelper      = require('../helpers/dynamodb')

const intentHandlers = require('./intents');
const channels = require('./channels');

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
      sessionId = uuid.v4();
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
              accessToken: userId,
              sessionId
            };

            await DynamoHelper.setUserSession(newSession);
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
    

    dialogflowResult = dialogflowResult.map(m => ({
      ...m,
      _id: uuid.v4(),
      sessionId,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Milia',
        avatar: 'https://placeimg.com/140/140/any',
      },
    }));

    await channels[originChannel].endMessageRequest(dialogflowResult, paramsUser);

    return callback(null, success({ dialogflowResult }));

  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }


};

module.exports = { handler };

