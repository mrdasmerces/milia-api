'use strict';

const { ErrorHandler }  = require('../utils/error-handling')
const { success }       = require('../utils/response')
const DynamoHelper      = require('../helpers/dynamodb')
const TripHelper      = require('../helpers/triphelper')
const { FRIENDLY_MESSAGES_INTENT } = require('../models/enum');
const moment = require('moment');

const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  try {
    const email = event.queryStringParameters.email;

    const ret = {
      imageUri: 'https://data.1freewallpapers.com/download/map-road-travel-trip-1024x576.jpg',
      imageTitle: 'Nenhuma viagem te espera :(',
      cardText: 'Fale já com a Milia!',
      buttonTitle: 'Cadastrar viagem',
      buttonAction: 'Milia',
      timelineText: 'Nenhuma postagem no diário',
      miliaText: 'A Milia vai tornar sua viagem mais legal',
    }

    const actualTrip = await DynamoHelper.getUserActualTrip(email);

    if(actualTrip) {
      if(await TripHelper.isTheCurrentTrip(actualTrip.startTripDate, actualTrip.endTripDate)) {

        ret.imageTitle = `Viagem atual para ${actualTrip.initialCountry}`;
        ret.imageUri = 'http://en.travelbd.xyz/wp-content/uploads/2018/09/travel-trip-itinerary-together-traveler-1024x576.jpg';
        
        const tripDays = moment(actualTrip.endTripDate).diff(moment(actualTrip.startTripDate), 'days');
        const actualDay = moment(moment().format()).diff(actualTrip.startTripDate, 'days');
        ret.cardText = `Dia ${actualDay} de ${tripDays}`;
        
        ret.buttonTitle = 'Explorar';
        ret.buttonAction = 'Roteiro';
      }

      if(await TripHelper.isTheNextTrip(actualTrip.startTripDate, actualTrip.endTripDate)) {

        ret.imageTitle = `${actualTrip.initialCountry} está chegando!`;
        ret.imageUri = 'https://data.1freewallpapers.com/download/map-road-travel-trip-1024x576.jpg';
        
        const daysLast = moment(actualTrip.startTripDate).diff(moment().format(), 'days')+1;
        ret.cardText = `Falta(m) ${daysLast} dia(s)`;
        
        ret.buttonTitle = 'Peça Dicas';
        ret.buttonAction = 'Milia';
      }
    }

    const messages = await DynamoHelper.getUserMessages(email);

    if(messages && messages.length) {

      const intents = messages.map(m => m.intent).filter(u => u !== undefined);

      let mf = 1;
      let m = 0;
      let item;
      for (let i=0; i<intents.length; i++)
      {
        for (let j=i; j<intents.length; j++)
        {
          if (intents[i] == intents[j])
            m++;
          if (mf<m)
          {
            mf=m; 
            item = intents[i];
          }
        }
        m=0;
      }

      ret.miliaText = FRIENDLY_MESSAGES_INTENT[item];
    }


    console.log('epa');


    return callback(null, success(ret));

  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }

};

module.exports = { handler };

