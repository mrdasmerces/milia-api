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
      message: {
        StatusCode: 200,
        StatusDescription: 'OK',
        chat_id: paramsUser.chat_id,
        parse_mode: 'Markdown',      
      },
      type: 'Message'
    };


    if(message.image) {
      const payloadImage = { message: {...payload.message}};
      payloadImage.message.photo = message.image;
      payloadImage.type = 'Photo';

      promises.push(payloadImage);
    };
    
    if(message.text) {
      payload.message.text = message.text;
    }

    if(message.template) {
      payload.message.text = message.template.payload.text;

      payload.message.reply_markup = {
        inline_keyboard: [[]]
      }

      for(const button of message.template.payload.buttons) {
        payload.message.reply_markup.inline_keyboard[0].push({
          text: button.title,
          url: button.url
        });
      }

      payload.message.reply_markup = JSON.stringify(payload.message.reply_markup);
    }

    promises.push(payload);
  }

  const promiseSerial = promises.reduce((p, item) => p.then(() =>
    post(`/bot${process.env.TELEGRAM_HASH}/send${item.type}`, item.message)), Promise.resolve());

  try {
    const result =  await promiseSerial;
    return result;
  } catch(e) {
    console.log(e);
  }
}

module.exports = {
  getUserId,
  getParametersRequest,
  endMessageRequest,
  sendTyping
};

