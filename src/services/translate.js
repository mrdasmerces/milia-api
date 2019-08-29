'use strict';

const { Translate } = require('@google-cloud/translate');

module.exports = async (text, target) => {
  const translate = new Translate({ projectId: process.env.DIALOGFLOW_PROJECT_ID});
  
  const [ translation ] = await translate.translate(text, target);

  return translation;
};
