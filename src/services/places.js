'use strict';

const axios = require('axios');

module.exports = (latitude, longitude, type) => {
 return axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=${type}&key=${process.env.GOOGLE_PLACES_KEY}`)
};
