'use strict';

const DynamoHelper = require('./dynamodb');
const moment = require('moment');
const uuid = require('uuid');

moment.locale('pt-BR');

const { getFirstPage, getNextPage, getDirections } = require('../services/attractions');



class TripHelper {

  static async buildTrip(tripDetails) {
    const isTheNextTrip = await TripHelper.isTheNextTrip(tripDetails.startTripDate, tripDetails.endTripDate);
    const isTheCurrentTrip = await TripHelper.isTheCurrentTrip(tripDetails.startTripDate, tripDetails.endTripDate);
    const isAPastTrip = await TripHelper.isAPastTrip(tripDetails.startTripDate, tripDetails.endTripDate);

    const newTrip = {
      tripId: uuid.v4(),
      ...tripDetails,
      isTheNextTrip,
      isAPastTrip,
      isTheCurrentTrip,
      itinerary: {}
    }

    await DynamoHelper.saveNewTrip(newTrip);
  };

  static async buildItinerary(attractionsPerDay, tripDays, tripId, city) {
    const attractions = await getFirstPage('rome');

    let expectedAttractions = tripDays * attractionsPerDay;
    let availableAttractions = attractions.data.results.length;

    let newAttractions = {...attractions};
    let finalAttractions = [...newAttractions.data.results];

    while(availableAttractions < expectedAttractions) {
      if(newAttractions.data.next_page_token) {
        newAttractions = await getNextPage(newAttractions.data.next_page_token);
        for(const attraction of newAttractions.data.results){
          finalAttractions.push(attraction);
          availableAttractions++;
        }
      } else {
        expectedAttractions = availableAttractions;
      }
    }

    finalAttractions = finalAttractions.slice(0, expectedAttractions);

    const itinerary = {
      days: [],
    };

    const mediumAttractionsPerDay = parseInt((expectedAttractions / parseInt(tripDays) ).toFixed(0));

    for(let actualDay = 1; actualDay <= tripDays; actualDay++) { 
      const newTripDay = {
        name: `Dia ${actualDay}`,
        markers: finalAttractions.splice(0, mediumAttractionsPerDay).map(p => ({
          key: p.id,
          identifier: p.place_id,
          title: p.name,
          description: p.formatted_address,
          latlng: {
            latitude: p.geometry.location.lat,
            longitude: p.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,            
          }
        }))
      };

      itinerary.days.push(newTripDay);
    }

    await DynamoHelper.setNewItinerary({itinerary, tripId});

    return { itinerary };
  };  

  static async validateTripDates(startDate, endDate, email) {
    let validate = true;
    // if(!startDate || !endDate) validate = false;

    // const today = moment();
    // if(moment(startDate).isBefore(today)) validate = false;
    // if(moment(endDate).isBefore(today)) validate = false;
    // if(moment(endDate).isBefore(startDate)) validate = false;
    // if(moment(startDate).isAfter(endDate)) validate = false;

    if(validate) validate = validate && await TripHelper.isAloneDateTrip(startDate, endDate, email);
    
    return validate; 
  };
  
  static async isAloneDateTrip(startDate, endDate, email) {
    return true;
    // if(!startDate || !endDate) return false;

    // const today = moment();
    // if(moment(startDate).isAfter(today)) return false;
    // if(moment(endDate).isBefore(today)) return false;
    // if(moment(endDate).isBefore(startDate)) return false;
    // if(moment(startDate).isAfter(endDate)) return false;

    // return true;
  }; 

  static async isTheCurrentTrip(startDate, endDate) {
    return true;
    // if(!startDate || !endDate) return false;

    // const today = moment().hours(23);
    // if(moment(startDate).isBefore(today) && (moment(endDate).isAfter(today))) return true;

    // return false;
  };

  
  static async isTheNextTrip(startDate, endDate) {
    return false;
    // if(!startDate || !endDate) return false;

    // const today = moment();
    // if(moment(startDate).isAfter(today)) return false;
    // if(moment(endDate).isBefore(today)) return false;
    // if(moment(endDate).isBefore(startDate)) return false;
    // if(moment(startDate).isAfter(endDate)) return false;

    // return true;
  };  
  
  static async isAPastTrip(startDate, endDate) {
    return false;
    // if(!startDate || !endDate) return false;

    // const today = moment();
    // if(moment(startDate).isAfter(today)) return false;
    // if(moment(endDate).isBefore(today)) return false;
    // if(moment(endDate).isBefore(startDate)) return false;
    // if(moment(startDate).isAfter(endDate)) return false;

    // return true;
  };

}

module.exports = TripHelper;