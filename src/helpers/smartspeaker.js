'use strict';

const { getSlotValue } = require('../utils/google-home')

class SmartSpeakerHelper {

  static async buildObjParameter(request) {
    const objParameter = {
      parameters: {
        fields: {}
      }
    }

    let any = getSlotValue(request.body.queryResult.parameters, 'any');
    let country = getSlotValue(request.body.queryResult.parameters, 'country');
    let geoCity = getSlotValue(request.body.queryResult.parameters, 'geo-city');

    if(any) {
      objParameter.parameters.fields.any = {
        stringValue: any,
      }
    }

    if(country) {
      objParameter.parameters.fields.country = {
        stringValue: country,
      }
    }
    
    if(geoCity) {
      objParameter.parameters.fields['geo-city'] = {
        stringValue: geoCity,
      }
    }     

    return objParameter;
  };

}

module.exports = SmartSpeakerHelper;