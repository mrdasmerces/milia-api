'use strict';

const { getFirstPage, buildPhotoUrl } = require('../../services/attractions');
const { removeAcento } = require('../../utils/remove-acento')

const WhatToDoIntent = async (result, paramsUser, originChannel) => {

  const dialogflowResult = [];

  try {
    let city = result.parameters.fields['geo-city'].stringValue;
    city = removeAcento(city);

    const locations = await getFirstPage(city);

    if(!locations.data.results.length) throw new Error('Nenhum lugar aberto agora de acordo com as buscas.');

    locations.data.results = locations.data.results.slice(0, 5);

    dialogflowResult.push({
      text: `Perfeito! Veja os melhores pontos turísticos de ${city}`,
    });

    for(const location of locations.data.results) {
      const newMessageResult = {
        text: `${location.name} - ${location.formatted_address}`,
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: [
            {
              title: 'Ir agora',
              value: 'goToPlace',
              function: 'goToPlace',
              mapUrl: `http://maps.google.com/?q=${location.geometry.location.lat},${location.geometry.location.lng}`,
              place_id: `${location.place_id}`,
            },
          ],
        },
        template: {
          payload: {
            template_type: "button",
            text: `${location.name} - ${location.formatted_address}`,
            buttons: [
              {
                type: "web_url",
                url: `http://maps.google.com/?q=${location.geometry.location.lat},${location.geometry.location.lng}`,
                title: "Ir agora"
              },
            ]
          }        
        }        
      };

      dialogflowResult.push(newMessageResult);

      if(location.photos && location.photos.length) {
        newMessageResult.image = await buildPhotoUrl(location.photos[0].photo_reference);
      }

    }
  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = WhatToDoIntent;

