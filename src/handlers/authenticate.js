'use strict';

const moment = require('moment');
const bcrypt = require('bcrypt-nodejs');

const {
  ItemNotFoundError, 
  MissingParamsError, 
} = require('../utils/custom-errors');

const DynamoHelper      = require('../helpers/dynamodb')
const { ErrorHandler }  = require('../utils/error-handling')
const { success }       = require('../utils/response')
const { generateToken } = require('../utils/generate-token')
const { messages }      = require('../utils/messages');

const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  try {
    const { username, password } = JSON.parse(event.body);

    if (!username) {
      throw new MissingParamsError(messages.user.missingUsernameParamError);
    }

    const user = await DynamoHelper.getUser(username);
    if (!user) {
      throw new ItemNotFoundError(messages.user.userInvalidError);
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    
    if (!validPassword) {
      throw new ItemNotFoundError(messages.user.userInvalidError);
    }

    const objToken = {
      email: username,
      loggedIn: moment().toDate()
    };

    const token = generateToken(objToken);

    await DynamoHelper.updateUserAccessToken(username, token);

    return callback(null, success({ token }));

  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }


};

module.exports = { handler };

