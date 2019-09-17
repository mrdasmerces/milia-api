'use strict';
const ForgotPasswordIntent = async (result, sessionId) => {

  const dialogflowResult = [];

  try {
    dialogflowResult.push({text: 'ForgotPasswordIntent'});
  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = ForgotPasswordIntent;

