'use strict';

const axios = require('axios');

module.exports = (latitude, longitude) => {
 return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCbhJQ9YTC73K1hRq0vH6fGkwBnW0BjeYc`)
};
