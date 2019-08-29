'use strict';

const placesService = require('../../services/places');

const PlacesIntent = async (result, paramsUser) => {

  const dialogflowResult = [];

  try {
    const type = result.parameters.fields['PLACES'].stringValue;
    const lastUserLocation = JSON.parse(paramsUser.lastPosition);

    const locations = await placesService(lastUserLocation.coords.latitude, lastUserLocation.coords.longitude, type);

    locations.data.results = locations.data.results.filter(l => l.opening_hours && l.opening_hours.open_now);
    locations.data.results = locations.data.results.slice(0, 3);

    if(!locations.data.results.length) throw new Error('Nenhum lugar aberto agora de acordo com as buscas.');

    dialogflowResult.push({
      text: `Perfeito! Veja os lugares mais próximos de você que estão aberto agora:`,
    });

    for(const location of locations.data.results) {
      dialogflowResult.push({
        text: `${location.name} - ${location.vicinity}`,
        image: `${location.icon}`,
        place_id: `${location.place_id}`,
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: [
            {
              title: 'Ir agora',
              value: 'goToPlace',
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

