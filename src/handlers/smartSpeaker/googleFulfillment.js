'use strict';

const {
  dialogflow,
} = require('actions-on-google');

const uuid = require('uuid');

const intents = require('../intents');
const SmartSpeakerHelper = require('../../helpers/smartspeaker')
const DynamoHelper = require('../../helpers/dynamodb')
const { getSlotValue } = require('../../utils/google-home')
const app = dialogflow();

const intentHandler = async (conv) => {
  let ret = [];

  try {
    const objParameter = await SmartSpeakerHelper.buildObjParameter(conv);
    ret = await intents[conv.body.queryResult.intent.displayName](objParameter, {}, '');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    ret.push({text: 'Desculpe, não entendi, poderia repetir por favor?'});
  }

  return ret;
};

// Register handlers for Dialogflow intents
app.intent('AttractionsIntent', async (conv) => {
  let ret = await intentHandler(conv);

  ret = ret.map(m => ({
    ...m,
    _id: uuid.v4(),
    createdAt: new Date().toString(),
    unred: true,
    user: {
      _id: 2,
      name: 'Milia',
      avatar: 'https://images-milia.s3.amazonaws.com/Webp.net-resizeimage.jpg',
    },
    intent: conv.body.queryResult.intent.displayName,
    email: 'matheus@gmail.com',
  }));

  const messagesPromises = [];

  for(const newMessageMilia of ret) {
    messagesPromises.push(DynamoHelper.setNewUserMessage(newMessageMilia));
  }

  await Promise.all(messagesPromises);  
 
  let any = getSlotValue(conv.body.queryResult.parameters, 'any');

  conv.close(`Dê uma olhada no xati do meu aplicativo Milia. Lá te mandei uma mensagem com tudo sobre ${any}.`)
});

app.intent('DocumentsIntent', async (conv) => {
  const ret = await intentHandler(conv);

  let responseText = '';
  for(const textRet of ret) {
    responseText += ` ${textRet.text} .`;
  };

  conv.close(responseText);
});

app.intent('AddToItineraryIntent', async (conv) => {
  const ret = await intentHandler(conv);

  let responseText = '';
  for(const textRet of ret) {
    responseText += ` ${textRet.text} .`;
  };

  conv.close(responseText);
});

app.intent('FoodIntent', async (conv) => {
  let ret = await intentHandler(conv);

  ret = ret.map(m => ({
    ...m,
    _id: uuid.v4(),
    unred: true,
    createdAt: new Date().toString(),
    user: {
      _id: 2,
      name: 'Milia',
      avatar: 'https://images-milia.s3.amazonaws.com/Webp.net-resizeimage.jpg',
    },
    intent: conv.body.queryResult.intent.displayName,
    email: 'matheus@gmail.com',
  }));

  const messagesPromises = [];

  for(const newMessageMilia of ret) {
    messagesPromises.push(DynamoHelper.setNewUserMessage(newMessageMilia));
  }

  await Promise.all(messagesPromises); 

  let country = getSlotValue(conv.body.queryResult.parameters, 'geo-country');

  conv.close(`Hum, fiquei com água na boca! Procurei aqui e te mandei as delícias que você pode comer em ${country}. Dê uma olhada agora no xati do meu aplicativo Milia!`)
});

app.intent('WhatToDoIntent', async (conv) => {
  let ret = await intentHandler(conv);

  ret = ret.map(m => ({
    ...m,
    _id: uuid.v4(),
    unred: true,
    createdAt: new Date().toString(),
    user: {
      _id: 2,
      name: 'Milia',
      avatar: 'https://images-milia.s3.amazonaws.com/Webp.net-resizeimage.jpg',
    },
    intent: conv.body.queryResult.intent.displayName,
    email: 'matheus@gmail.com',
  }));

  const messagesPromises = [];

  for(const newMessageMilia of ret) {
    messagesPromises.push(DynamoHelper.setNewUserMessage(newMessageMilia));
  }

  await Promise.all(messagesPromises);  
 
  let geoCity = getSlotValue(conv.body.queryResult.parameters, 'geo-city');

  conv.close(`Te mandei os lugares mais legais de ${geoCity}. Dê uma olhada agora no xati do meu aplicativo Milia!`)
});

exports.fulfillment = app;
