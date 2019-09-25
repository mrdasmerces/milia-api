'use strict';

const WhatToDoIntent = async (result, paramsUser, originChannel) => {

  const dialogflowResult = [];

  try {

    dialogflowResult.push({text: 'WhatToDoIntent'});
  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = WhatToDoIntent;

