const jwt = require('jsonwebtoken');

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

const denyPolicy = (principalId, resource) => generatePolicy(principalId, 'Deny', resource);

const allowPolicy = (principalId, resource) => generatePolicy(principalId, 'Allow', resource);

const handler = async (event, context, callback) => {
  const secret = process.env.SECRET_TOKEN;

  // Authorize header on the request
  const { authorizationToken } = event;

  if (authorizationToken) {
    jwt.verify(authorizationToken, secret, (err, decoded) => {
      if (err) {
        // return callback(null, denyPolicy('anonymous', event.methodArn));
        // return callback(null, denyPolicy('anonymous', '*'));
        // verificar se é por expirado ou algum outro motivo, e retornar o 401 só quando for expirado
        return callback('Unauthorized');
      }

      // return callback(null, allowPolicy('user', event.methodArn));
      return callback(null, allowPolicy('user', '*'));
    });
  } else {
    return callback(null, denyPolicy('anonymous', '*'));
  }
};

module.exports = { handler };
