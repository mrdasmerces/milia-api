'use strict';

const dialogflow = require('dialogflow');
const uuid = require('uuid');

const {
  MissingParamsError, 
} = require('../utils/custom-errors');

const { ErrorHandler }  = require('../utils/error-handling')
const { success }       = require('../utils/response')

const chatbotHandlers = require('./chatbot');

const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  try {
    let dialogflowResult = {};

    const { queryText, paramsUser } = JSON.parse(event.body);

    if (!queryText || !paramsUser) {
      throw new MissingParamsError();
    }

    const sessionId = uuid.v4();
  
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
      dialogflowResult = await chatbotHandlers[result.intent.displayName](result, paramsUser);
    } else {
      dialogflowResult.response = 'Hum, não entendi, pode reformular sua frase? :)'
    }

    return callback(null, success({ dialogflowResult }));

  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }


};

module.exports = { handler };

