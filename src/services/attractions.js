'use strict';

const axios = require('axios');

module.exports = {
  getFirstPage: (city) => {
    return axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}+points+of+interest&language=pt-BR&key=${process.env.GOOGLE_MAPS_KEY}`);
  },
  getNextPage: (nextPageToken) => {
    return axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${nextPageToken}&language=pt-BR&key=${process.env.GOOGLE_MAPS_KEY}`);
  },
  getDirections: (hotelLocation, placesToVisit) => {
    return axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${hotelLocation}&destination=${hotelLocation}&waypoints=optimize:true${placesToVisit}&language=pt-BR&key=${process.env.GOOGLE_MAPS_KEY}`);
  },  
};
