'use strict';
const { BUTTOM_DOWNLOAD_TEMPLATE } = require('../../models/enum');

const AttractionsIntent = async (result, paramsUser, originChannel) => {

  const dialogflowResult = [];

  try {
    if(!paramsUser.lastPosition && originChannel != 'App') {
      dialogflowResult.push({
        template: BUTTOM_DOWNLOAD_TEMPLATE,
      });

      return dialogflowResult;
    }

    dialogflowResult.push({text: 'AttractionsIntent'});
  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = AttractionsIntent;

