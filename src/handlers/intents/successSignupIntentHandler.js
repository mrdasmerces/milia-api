'use strict';

const DynamoHelper      = require('../../helpers/dynamodb');
const TripHelper      = require('../../helpers/triphelper')
const bcrypt = require('bcrypt-nodejs');

const SuccessSignupIntent = async (result, sessionId) => {

  const dialogflowResult = [];

  try {
    const session = await DynamoHelper.getUserSession(sessionId);
    const dynamoContext = JSON.parse(session.dynamoContext);
    const salt = bcrypt.genSaltSync('10');
    const password = bcrypt.hashSync(dynamoContext.parameters.fields.password.stringValue, salt);

    const newUser = {
      email: dynamoContext.parameters.fields.email.stringValue.toLowerCase(),
      name: dynamoContext.parameters.fields.name.stringValue,
      lastName: dynamoContext.parameters.fields.last_name.stringValue,
      birthday: dynamoContext.parameters.fields.birthday.stringValue,
      password,
      accessToken: '0',
    };

    await DynamoHelper.setNewUser(newUser);

    const tripDetais = {
      email: dynamoContext.parameters.fields.email.stringValue.toLowerCase(),
      initialCity: dynamoContext.parameters.fields.city.stringValue,
      initialCountry: dynamoContext.parameters.fields.country.stringValue,
      startTripDate: dynamoContext.parameters.fields.trip_date.structValue.fields.startDate.stringValue,
      endTripDate: dynamoContext.parameters.fields.trip_date.structValue.fields.endDate.stringValue,
    };

    await TripHelper.buildTrip(tripDetais);

    dialogflowResult.push({
      text: 'Vamos nessa! :) Só um segundo...', 
      authenticateUser: true,
      username:  dynamoContext.parameters.fields.email.stringValue.toLowerCase(),
      password: dynamoContext.parameters.fields.password.stringValue,
    });

  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Ops, tive um probleminha para salvar sua viagem. Por favor, tente novamente mais tarde.'});
  }
  
  return dialogflowResult;

};

module.exports = SuccessSignupIntent;

