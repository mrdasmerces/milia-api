'use strict';

const AttractionsIntent = require('./attractionsIntentHandler');
const EmergencyIntent = require('./emergencyIntentHandler');
const ExchangeIntent = require('./exchangeIntentHandler');
const FoodIntent = require('./foodIntentHandler');
const LanguageIntent = require('./languageIntentHandler');
const PlacesIntent = require('./placesIntentHandler');
const FallbackIntent = require('./fallbackIntentHandler');

module.exports = {
  AttractionsIntent,
  EmergencyIntent,
  ExchangeIntent,
  FoodIntent,
  LanguageIntent,
  PlacesIntent,
  FallbackIntent,
}