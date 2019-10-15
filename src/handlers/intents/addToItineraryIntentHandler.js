'use strict';

const { getAttractionByName } = require('../../services/attractions');

const AddToItineraryIntent = async (result) => {

  const dialogflowResult = [];

  try {
    const placeName = result.parameters.fields.any.stringValue;

    const ret = await getAttractionByName(placeName);

    const placeFound = ret.data.candidates[0];

    dialogflowResult.push({text: placeFound.name});
  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = AddToItineraryIntent;

