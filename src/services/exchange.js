'use strict';

const axios = require('axios');

module.exports = (base) => {
 return axios.get(`https://api.exchangeratesapi.io/latest?symbols=BRL&base=${base}`)
};
