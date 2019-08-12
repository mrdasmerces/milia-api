const build = (statusCode, body) => ({
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  statusCode,
  body
});

const success = body => build(200, body);
const businessRuleError = body => build(422, body);
const tokenRefreshError = body => build(400, body);
const permissionDenied = body => build(401, body);
const notFound = body => build(404, body);
const failure = body => build(500, body);
const badData = () => build(422, {
  error: 'Unprocessable Entity',
  message: 'your data is bad and you should feel bad'
});

module.exports = {
  build,
  success,
  businessRuleError,
  permissionDenied,
  notFound,
  badData,
  tokenRefreshError,
  failure
};
