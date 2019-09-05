'use strict';

const FallbackIntent = async (result, paramsUser) => {

  const dialogflowResult = [];

  try {
    dialogflowResult.push({text: 'Ok, sem problemas, fico à sua disposição :)'});
  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, acho que me confundi :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = FallbackIntent;

