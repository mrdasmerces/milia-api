'use strict';

const { LANGUAGES } = require('../../models/enum');
const translateService = require('../../services/translate');

const LanguageIntent = async (result) => {

  const dialogflowResult = [];

  try {
    const languageTo = result.parameters.fields['lang-to'].stringValue.toLowerCase();
    const text = result.parameters.fields['text'].stringValue;
    const target = LANGUAGES[languageTo];
    let from = 'pt';

    if(result.parameters.fields['lang-from'].stringValue) {
      from = LANGUAGES[result.parameters.fields['lang-from'].stringValue];
    }

    const translation = await translateService(text, target, from)
    dialogflowResult.push({text: `Ótimo! ${text} em ${languageTo} é ${translation}`});

  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Que tal falar de outra forma?'});
  }
  
  return dialogflowResult;

};

module.exports = LanguageIntent;

