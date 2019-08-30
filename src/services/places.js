'use strict';

const axios = require('axios');

module.exports = (latitude, longitude, type, radius, minPrice, maxPrice, keyword) => {
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&minprice=${minPrice}&maxprice=${maxPrice}&radius=${radius}&type=${type}&opennow&`;

  if (keyword) {
    url += `keyword=${keyword}`;
  }

  url += `&key=${process.env.GOOGLE_PLACES_KEY}`;
  return axios.get(url)
};
