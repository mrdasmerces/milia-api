'use strict';

const LanguageIntent = async (result, paramsUser) => {

  const dialogflowResult = [];

  try {
    dialogflowResult.push({text: 'LanguageIntent'});
  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = LanguageIntent;

