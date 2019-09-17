'use strict';

const moment = require('moment');
moment.locale('pt-BR');

class TripHelper {

  static async buidTrip(tripDetails) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-users`;
    const idKey = 'email';
    return AwsHelper.findById(idKey, idValue, table);
  };

  static async validateTripDates(startDate, endDate) {
    if(!startDate || !endDate) return false;

    const today = moment();
    if(moment(startDate).isBefore(today)) return false;
    if(moment(endDate).isBefore(today)) return false;
    if(moment(endDate).isBefore(startDate)) return false;
    if(moment(startDate).isAfter(endDate)) return false;

    return true;
  };

  static async isTheCurrentTrip(startDate, endDate) {
    if(!startDate || !endDate) return false;

    const today = moment().hours(23);
    if(moment(startDate).isBefore(today) && (moment(endDate).isAfter(today))) return true;

    return false;
  };
  
  static async isTheNextTrip(startDate, endDate) {
    if(!startDate || !endDate) return false;

    const today = moment();
    if(moment(startDate).isAfter(today)) return false;
    if(moment(endDate).isBefore(today)) return false;
    if(moment(endDate).isBefore(startDate)) return false;
    if(moment(startDate).isAfter(endDate)) return false;

    return true;
  };  

}

module.exports = TripHelper;