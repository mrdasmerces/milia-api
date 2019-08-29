'use strict';

const axios = require('axios');

module.exports = (latitude, longitude) => {
 return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_KEY}`)
};
