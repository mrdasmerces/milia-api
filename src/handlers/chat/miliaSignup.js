'use strict';

const dialogflow = require('dialogflow');
const uuid = require('uuid');

const {
  MissingParamsError, 
} = require('../../utils/custom-errors');

const { ErrorHandler }  = require('../../utils/error-handling')
const { success }       = require('../../utils/response')
const DynamoHelper      = require('../../helpers/dynamodb')

const intentHandlers = require('../intents');

const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  try {
    const requestBody = JSON.parse(event.body);
    const { queryText, idSessionSignup } = requestBody;

    if (!queryText || !idSessionSignup) {
      throw new MissingParamsError();
    }

    const session = await DynamoHelper.getUserSession(idSessionSignup);

    let sessionId = '';
    if(session) {
      sessionId = session.sessionId;
    } else {
      sessionId = idSessionSignup;
    }

    let dialogflowResult = [];
  
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
        const newMessages = await intentHandlers[result.intent.displayName](result, sessionId);
        dialogflowResult = newMessages;
      }

    } else {
      dialogflowResult.push({text: 'Desculpe, não posso te ajudar com isso agora :( Vamos fazer seu cadastro antes. Pode repetir por favor?'});
    }

    dialogflowResult = dialogflowResult.map(m => ({
      ...m,
      _id: uuid.v4(),
      sessionId,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Milia',
        avatar: 'https://images-milia.s3.amazonaws.com/Webp.net-resizeimage.jpg',
      },
    }));

    return callback(null, success({ dialogflowResult }));

  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }


};

module.exports = { handler };

