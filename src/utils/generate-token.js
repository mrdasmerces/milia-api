const jwt = require('jsonwebtoken');

const generateToken = (objToken) => {
  return jwt.sign(objToken, process.env.SECRET_TOKEN);
}

module.exports = { generateToken };
