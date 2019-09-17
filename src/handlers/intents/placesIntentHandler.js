'use strict';

const placesService = require('../../services/places');
const { BUTTOM_DOWNLOAD_TEMPLATE } = require('../../models/enum');

const PlacesIntent = async (result, paramsUser, originChannel) => {

  const dialogflowResult = [];

  try {
    if(!paramsUser.lastPosition && originChannel != 'App') {
      dialogflowResult.push({
        template: BUTTOM_DOWNLOAD_TEMPLATE,
      });

      return dialogflowResult;
    }

    const type = result.parameters.fields['PLACES'].stringValue;
    const keyword = result.parameters.fields['FOOD_TYPE'] ? result.parameters.fields['FOOD_TYPE'].stringValue : '';
    const radius = result.parameters.fields['DISTANCE'].stringValue;
    const minPrice = result.parameters.fields['PRICE'].stringValue[0];
    const maxPrice = result.parameters.fields['PRICE'].stringValue[2];

    const lastUserLocation = JSON.parse(paramsUser.lastPosition);

    const locations = await placesService(lastUserLocation.coords.latitude, lastUserLocation.coords.longitude, type, radius, minPrice, maxPrice, keyword);

    if(!locations.data.results.length) throw new Error('Nenhum lugar aberto agora de acordo com as buscas.');

    locations.data.results = locations.data.results.slice(0, 3);

    dialogflowResult.push({
      text: `Perfeito! Veja os lugares mais próximos de você que estão aberto agora:`,
    });

    for(const location of locations.data.results) {
      dialogflowResult.push({
        text: `${location.name} - ${location.vicinity}`,
        image: 'https://placeimg.com/274/274/arch',
        quickReplies: {
          type: 'radio',
          keepIt: false,
          values: [
            {
              title: 'Ir agora',
              value: 'goToPlace',
              function: 'goToPlace',
              place_id: `${location.place_id}`,
            },
          ],
        },
      });
    }

  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não encontrei nenhum lugar pra você agora :( Que tal perguntar de outra forma?'});
  }
  
  return dialogflowResult;

};

module.exports = PlacesIntent;

