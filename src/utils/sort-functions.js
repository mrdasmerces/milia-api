const moment = require('moment');

const byDateAsc = (a, b) => {
  const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);
  if(moment(dateA, 'YYYYMMDDHHmmss').isAfter(moment(dateB, 'YYYYMMDDHHmmss').format())) {
  return 1;
  }
  if(moment(dateA, 'YYYYMMDDHHmmss').isBefore(moment(dateB, 'YYYYMMDDHHmmss').format())) {
  return -1;
  }
  return 0;
};

module.exports = { byDateAsc }