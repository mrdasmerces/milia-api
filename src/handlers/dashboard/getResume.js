'use strict';

const { ErrorHandler }  = require('../../utils/error-handling')
const { success }       = require('../../utils/response')
const DynamoHelper      = require('../../helpers/dynamodb')
const TripHelper      = require('../../helpers/triphelper')
const { FRIENDLY_MESSAGES_INTENT } = require('../../models/enum');
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
      timelineText: 'Nenhum marco no diário',
      miliaText: 'A Milia vai tornar sua viagem mais legal',
      details: {
        messages: `Nenhuma mensagem com a Milia`,
        placesVisited: 'Nenhuma experiência até agora',
        placesToVisit: 'Nenhum lugar para conhecer',
        timeline: 'Nenhum marco até agora',
      }
    }

    const actualTrip = await DynamoHelper.getUserActualTrip(email);

    let messages = await DynamoHelper.getUserMessages(email);
    let timeline = await DynamoHelper.getUserTimeline(email);

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
    
    if(timeline && timeline.length) ret.timelineText = `Você tem ${timeline.length} marcos no diário!`

    if(actualTrip) {
      if(await TripHelper.isTheCurrentTrip(actualTrip.startTripDate, actualTrip.endTripDate)) {

        ret.imageTitle = `Viagem atual para ${actualTrip.initialCountry}`;
        ret.imageUri = 'http://en.travelbd.xyz/wp-content/uploads/2018/09/travel-itinerary-together-traveler-1024x576.jpg';
        
        const tripDays = moment(actualTrip.endTripDate).diff(moment(actualTrip.startTripDate), 'days')+1;
        const actualDay = moment(moment().format()).diff(actualTrip.startTripDate, 'days')+1;
        ret.cardText = `Dia ${actualDay} de ${tripDays}`;
        
        ret.buttonTitle = 'Explorar';
        ret.buttonAction = 'Roteiro';

        let placesVisited = 0;
        let placesToVisit = 0;
        const itinerary = await DynamoHelper.getTripItinerary(actualTrip.tripId);

        if (itinerary) {
          const { days } = itinerary.itinerary;
          const tripDaysIncome = days.splice(actualDay, itinerary.itinerary.days.length);
          const tripDaysPassed = itinerary.itinerary.days.splice(0, actualDay-1);

          if(tripDaysPassed) {
            for(const day of tripDaysPassed) {
              for(const marker of day.markers) {
                placesVisited++;
              }
            }          
          }

          if(tripDaysIncome) {
            for(const day of tripDaysIncome) {
              for(const marker of day.markers) {
                placesToVisit++;
              }
            }          
          }

          timeline = timeline.filter(t => t.tripId === actualTrip.tripId);
          messages = messages.filter(m => m.tripId === actualTrip.tripId);

          ret.buttonTitle = 'Ver detalhes';
          ret.buttonAction = 'Modal';
          ret.details.messages = messages.length > 0 ? `${messages.length} mensagens com a Milia` : `Nenhuma mensagem com a Milia`;
          ret.details.placesVisited = placesVisited > 0 ? `${placesVisited} novas experiências` : 'Nenhuma experiência até agora';
          ret.details.placesToVisit = placesToVisit > 0 ? `${placesToVisit} lugares para conhecer` : 'Nenhum lugar para conhecer';
          ret.details.timeline = timeline && timeline.length > 0 ? `${timeline.length} marcos importantes` : 'Nenhum marco até agora';   
        }
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

    return callback(null, success(ret));

  } catch(e) {
    const errorMessage = await ErrorHandler(e, event, context);
    console.log(errorMessage);
    return callback(null, errorMessage);
  }

};

module.exports = { handler };

