const { 
  failure, 
  notFound, 
  badData, 
  businessRuleError, 
  permissionDenied, 
  tokenRefreshError 
} = require('./response');

const createErrorObject = (code, message) => ({ code, message });

const ErrorHandler = async (error, event, context) => new Promise(async (resolve) => {
  let objError = {};

  switch (error.name) {
    case 'SecretError':
      objError = notFound({ error: createErrorObject(error.name, error.message) });
      break;
    case 'DbConnectionError':
      objError = failure({ error: createErrorObject(error.name, error.message) });
      break;
    case 'ItemNotFoundError':
      objError = notFound({ error: createErrorObject(error.name, error.message) });
      break;
    case 'ResourceNotAvailableError':
      objError = failure({ error: createErrorObject(error.name, error.message) });
      break;
    case 'GenericError':
      objError = failure({ error: createErrorObject(error.name, error.message) });
      break;
    case 'BusinessRuleError':
      objError = businessRuleError({ error: createErrorObject(error.name, error.message) });
      break;
    case 'PermissionError':
      objError = permissionDenied({ error: createErrorObject(error.name, error.message) });
      break;
    case 'TokenRefreshError':
      objError = tokenRefreshError({ error: createErrorObject(error.name, error.message) });
      break;
    case 'UserTokenError':
      objError = failure({ error: createErrorObject(error.name, error.message) });
      break;
    case 'MissingParamsError':
      objError = badData({ error: createErrorObject(error.name, error.message) });
      break;
    default:
      objError = failure({ error: createErrorObject(error.name, error.message) });
      break;
  }
  resolve(objError);
});

module.exports = { ErrorHandler };
