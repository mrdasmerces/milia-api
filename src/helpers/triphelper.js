'use strict';

const DynamoHelper = require('./dynamodb');
const moment = require('moment');
const uuid = require('uuid');

moment.locale('pt-BR');

const { getFirstPage, getNextPage } = require('../services/attractions');
const { removeAcento } = require('../utils/remove-acento');

class TripHelper {

  static async buildTrip(tripDetails) {
    const newTrip = {
      tripId: uuid.v4(),
      ...tripDetails,
    }

    await DynamoHelper.saveNewTrip(newTrip);
  };

  static async buildItinerary(attractionsPerDay, tripDays, tripId, city, hotelLocation) {
    const newCity = removeAcento(city);
    const attractions = await getFirstPage(newCity);

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
      hotelLocation,
    };

    const mediumAttractionsPerDay = parseInt((expectedAttractions / parseInt(tripDays) ).toFixed(0));

    for(let actualDay = 1; actualDay <= tripDays; actualDay++) { 
      const newTripDay = {
        name: `Dia ${actualDay}`,
        markers: finalAttractions.splice(0, mediumAttractionsPerDay).map(p => ({
          identifier: p.place_id,
          title: p.name,
          description: p.formatted_address,
          latitude: p.geometry.location.lat,
          longitude: p.geometry.location.lng,
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
    if(!startDate || !endDate) return false;

    const today = moment().hours(23);
    if(moment(startDate).isBefore(today) && (moment(endDate).isAfter(today))) return true;

    return false;
  };

  
  static async isTheNextTrip(startDate, endDate) {
    if(!startDate || !endDate) return false;

    const today = moment().format();
    if(moment(startDate).isBefore(today)) return false;
    if(moment(endDate).isBefore(today)) return false;

    return true;
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