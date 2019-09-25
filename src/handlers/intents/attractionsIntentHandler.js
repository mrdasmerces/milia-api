'use strict';
const { BUTTOM_DOWNLOAD_TEMPLATE } = require('../../models/enum');

const { getAttractionByName } = require('../../services/attractions');

const AttractionsIntent = async (result, paramsUser, originChannel) => {

  const dialogflowResult = [];

  try {
    if(!paramsUser.lastPosition && originChannel != 'App') {
      dialogflowResult.push({
        template: BUTTOM_DOWNLOAD_TEMPLATE,
      });

      return dialogflowResult;
    }

    const placeName = result.parameters.fields.any.stringValue;

    const ret = await getAttractionByName(placeName);

    const placeFound = ret.data.candidates[0];

    dialogflowResult.push({
      text: `${placeFound.name} - ${placeFound.formatted_address}`,
      image: 'https://placeimg.com/274/274/arch',
      quickReplies: {
        type: 'radio',
        keepIt: false,
        values: [
          {
            title: 'Ir agora',
            value: 'goToPlace',
            function: 'goToPlace',
            place_id: `${placeFound.place_id}`,
            marker: JSON.stringify({
              identifier: placeFound.place_id,
              title: placeFound.name,
              description: placeFound.formatted_address,
              latitude: placeFound.geometry.location.lat,
              longitude: placeFound.geometry.location.lng,
            })
          },
          {
            title: 'Adicionar ao roteiro',
            value: 'addToItinerary',
            function: 'addToItinerary',
            place_id: `${placeFound.place_id}`,
            marker: JSON.stringify({
              identifier: placeFound.place_id,
              title: placeFound.name,
              description: placeFound.formatted_address,
              latitude: placeFound.geometry.location.lat,
              longitude: placeFound.geometry.location.lng,
            })
          },
        ],
      },
    });

  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = AttractionsIntent;

