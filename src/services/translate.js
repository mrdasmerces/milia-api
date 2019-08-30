'use strict';

const { Translate } = require('@google-cloud/translate');

module.exports = async (text, to, from) => {
  const translate = new Translate({ projectId: process.env.DIALOGFLOW_PROJECT_ID});
  
  const options = {
    from,
    to
  };

  const [ translation ] = await translate.translate(text, options);

  return translation;
};
