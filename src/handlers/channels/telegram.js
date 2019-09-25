'use strict';

const axios = require('axios');

const getUserId = async (requestBody) => {
  return requestBody.message.from.id.toString();
};

const getParametersRequest = async (requestBody) => {
  const paramsUser = {
    chat_id: requestBody.message.chat.id,
  };
  return { queryText: requestBody.message.text, paramsUser };
}

const sendTyping = async (paramsUser) => {
  console.log('channel: Telegram - Milia está digitando...');
  const payloadTyping = {
    StatusCode: 200,
    StatusDescription: 'OK',
    chat_id: paramsUser.chat_id,
    action: 'typing',
  };

  const { post } = axios.create({
    baseURL: 'https://api.telegram.org',
    timeout: +process.env.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'cache-Control': 'no-cache',
    },
  });

  const response = await post(`/bot${process.env.TELEGRAM_HASH}/sendChatAction`, payloadTyping);
  return response;
};

const endMessageRequest = async (dialogflowResult, paramsUser) => {

  const { post } = axios.create({
    baseURL: 'https://api.telegram.org',
    timeout: +process.env.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'cache-Control': 'no-cache',
    },
  });

  const promises = [];
  for(const message of dialogflowResult) {

    const payload = {
      StatusCode: 200,
      StatusDescription: 'OK',
      chat_id: paramsUser.chat_id,
      parse_mode: 'Markdown',      
    };

    if(message.text) {
      payload.text = message.text;
    }

    if(message.template) {
      payload.text = message.template.payload.text;

      payload.reply_markup = {
        inline_keyboard: [[]]
      }

      for(const button of message.template.payload.buttons) {
        payload.reply_markup.inline_keyboard[0].push({
          text: button.title,
          url: button.url
        });
      }

      payload.reply_markup = JSON.stringify(payload.reply_markup);
    }

    promises.push(post(`/bot${process.env.TELEGRAM_HASH}/sendMessage`, payload))


    if(message.image) {
      const payloadImage = {...payload};
      payloadImage.photo = message.image;

      promises.push(post(`/bot${process.env.TELEGRAM_HASH}/sendPhoto`, payloadImage))
    };

  }

  const response = Promise.all(promises);

  return response;
}

module.exports = {
  getUserId,
  getParametersRequest,
  endMessageRequest,
  sendTyping
};

