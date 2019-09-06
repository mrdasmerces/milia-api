'use strict';

const getUserId = async (requestBody) => {
  return requestBody.message.from.id;
};

const getParametersRequest = async (requestBody) => {
  const paramsUser = {};
  return { queryText: requestBody.message.text, paramsUser };
}

const sendTyping = async () => {
  console.log('channel: Telegram - Milia está digitando...');
};

const endMessageRequest = async (dialogflowResult) => {
  console.log(dialogflowResult);
}

module.exports = {
  getUserId,
  getParametersRequest,
  endMessageRequest,
  sendTyping
};

