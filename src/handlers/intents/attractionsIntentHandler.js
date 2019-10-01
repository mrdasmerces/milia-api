'use strict';
const { getAttractionByName, buildPhotoUrl } = require('../../services/attractions');

const DynamoHelper      = require('../../helpers/dynamodb')
const TripHelper      = require('../../helpers/triphelper')
const moment            = require('moment');

const AttractionsIntent = async (result, paramsUser, originChannel) => {

  const dialogflowResult = [];

  try {

    const placeName = result.parameters.fields.any.stringValue;

    const ret = await getAttractionByName(placeName);

    const placeFound = ret.data.candidates[0];

    const newMessageResult = {
      text: `${placeFound.name} - ${placeFound.formatted_address}`,
      quickReplies: {
        type: 'radio',
        keepIt: false,
        values: [
          {
            title: 'Ir agora',
            value: 'goToPlace',
            function: 'goToPlace',
            place_id: `${placeFound.place_id}`,
            mapUrl: `http://maps.google.com/?q=${placeFound.geometry.location.lat},${placeFound.geometry.location.lng}`,
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
      template: {
        payload: {
          template_type: "button",
          text: `${placeFound.name} - ${placeFound.formatted_address}`,
          buttons: [
            {
              type: "web_url",
              url: `http://maps.google.com/?q=${placeFound.geometry.location.lat},${placeFound.geometry.location.lng}`,
              title: "Ir agora"
            },
          ]
        }        
      }
    };

    if(placeFound.photos && placeFound.photos.length) {
      newMessageResult.image = await buildPhotoUrl(placeFound.photos[0].photo_reference);
    }

    if(paramsUser.email && originChannel === 'App') {
      const actualTrip = await DynamoHelper.getUserActualTrip(paramsUser.email);
      if(actualTrip) {
        const itinerary = await DynamoHelper.getTripItinerary(actualTrip.tripId);
        if(itinerary) {
          const actualDayIndex = moment(moment().format()).diff(actualTrip.startTripDate, 'days');

          itinerary.itinerary.days = itinerary.itinerary.days.splice(actualDayIndex);

          newMessageResult.quickReplies.values.push({
            title: 'Adicionar ao roteiro',
            value: 'Adicione este lugar ao meu roteiro!',
            function: 'addToItinerary',
            place_id: `${placeFound.place_id}`,
            itinerary: JSON.stringify(itinerary),
            marker: JSON.stringify({
              identifier: placeFound.place_id,
              title: placeFound.name,
              description: placeFound.formatted_address,
              latitude: placeFound.geometry.location.lat,
              longitude: placeFound.geometry.location.lng,
            })            
          })
        }
      }      
    }

    dialogflowResult.push(newMessageResult);

  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = AttractionsIntent;

