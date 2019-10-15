'use strict';

const getUserId = async (requestBody, headers) => {
  return headers.accesstoken;
};

const getParametersRequest = async (requestBody) => {
  return { queryText: requestBody.queryText, paramsUser: requestBody.paramsUser };
}

const sendTyping = async () => {
  console.log('channel: App - Milia está digitando...');
};

const endMessageRequest = async (dialogflowResult) => {
  console.log('endMessageRequest App', dialogflowResult);
}

module.exports = {
  getUserId,
  getParametersRequest,
  endMessageRequest,
  sendTyping
};

