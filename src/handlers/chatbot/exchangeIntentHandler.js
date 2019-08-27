'use strict';

const ExchangeIntent = async (result, paramsUser) => {

  const dialogflowResult = [];

  try {
    dialogflowResult.push({text: 'ExchangeIntent'});
  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = ExchangeIntent;

