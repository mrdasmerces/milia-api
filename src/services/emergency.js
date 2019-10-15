'use strict';

const axios = require('axios');

module.exports = (country) => {
 return axios.get(`http://emergencynumberapi.com/api/country/${country}`)
};
