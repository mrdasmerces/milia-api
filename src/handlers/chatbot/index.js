'use strict';

const Attractions = require('./attractionsHandler');
const EmergencyIntent = require('./emergencyIntentHandler');
const ExchangeIntent = require('./exchangeIntentHandler');
const FoodIntent = require('./foodIntentHandler');
const LanguageIntent = require('./languageIntentHandler');
const PlacesIntent = require('./placesIntentHandler');

module.exports = {
  Attractions,
  EmergencyIntent,
  ExchangeIntent,
  FoodIntent,
  LanguageIntent,
  PlacesIntent,
}