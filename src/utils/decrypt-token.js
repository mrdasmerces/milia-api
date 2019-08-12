const { PermissionError } = require('../utils/custom-errors');
const { messages } = require('./messages');

const jwt = require('jsonwebtoken');

const decryptToken = token => new Promise(async (resolve, reject) => {
  const secret = process.env.SECRET_TOKEN;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      reject(new PermissionError(messages.decryptTokenError));
    }
    resolve(decoded);
  });
});

module.exports = { decryptToken };
