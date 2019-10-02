'use strict';

const AttractionsIntent = require('./attractionsIntentHandler');
const EmergencyIntent = require('./emergencyIntentHandler');
const ExchangeIntent = require('./exchangeIntentHandler');
const FoodIntent = require('./foodIntentHandler');
const LanguageIntent = require('./languageIntentHandler');
const PlacesIntent = require('./placesIntentHandler');
const FallbackIntent = require('./fallbackIntentHandler');
const ForgotPasswordIntent = require('./forgotPasswordIntentHandler');
const SignupIntent = require('./signupIntentHandler');
const SuccessSignupIntent = require('./successSignupIntentHandler');
const DocumentsIntent = require('./documentsIntentHandler');
const WhatToDoIntent = require('./whatToDoIntentHandler');
const AddToItineraryIntent = require('./addToItineraryIntentHandler');

module.exports = {
  AttractionsIntent,
  EmergencyIntent,
  ExchangeIntent,
  FoodIntent,
  LanguageIntent,
  PlacesIntent,
  FallbackIntent,
  ForgotPasswordIntent,
  SignupIntent,
  SuccessSignupIntent,
  DocumentsIntent,
  WhatToDoIntent,
  AddToItineraryIntent,
}