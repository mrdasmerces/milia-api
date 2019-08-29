'use strict';

const axios = require('axios');

module.exports = (country) => {
 return axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`)
};
