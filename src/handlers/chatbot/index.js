'use strict';

const CommuteIntent = require('./commuteIntentHandler');
const EmergencyIntent = require('./emergencyIntentHandler');
const ExchangeIntent = require('./exchangeIntentHandler');
const FoodIntent = require('./foodIntentHandler');
const LanguageIntent = require('./languageIntentHandler');
const PlacesIntent = require('./placesIntentHandler');

module.exports = {
  CommuteIntent,
  EmergencyIntent,
  ExchangeIntent,
  FoodIntent,
  LanguageIntent,
  PlacesIntent,
}