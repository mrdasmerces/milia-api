'use strict';

const DynamoHelper = require('./dynamodb');
const moment = require('moment');
moment.locale('pt-BR');


class TripHelper {

  static async buidTrip(tripDetails) {
    const isTheNextTrip = await TripHelper.isTheNextTrip(tripDetails.startTripDate, tripDetails.endTripDate);
    const isTheCurrentTrip = await TripHelper.isTheCurrentTrip(tripDetails.startTripDate, tripDetails.endTripDate);
    const isAPastTrip = await TripHelper.isAPastTrip(tripDetails.startTripDate, tripDetails.endTripDate);

    const itinerary = {
      types: [],
    };

    const newTrip = {
      ...tripDetails,
      isTheNextTrip,
      isAPastTrip,
      isTheCurrentTrip,
      itinerary,
    }

    await DynamoHelper.saveNewTrip(newTrip);
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