'use strict';

const DynamoHelper      = require('../../helpers/dynamodb');
const TripHelper      = require('../../helpers/triphelper')
const bcrypt = require('bcrypt-nodejs');

const SuccessSignupIntent = async (result, sessionId) => {

  const dialogflowResult = [];

  try {
    const session = await DynamoHelper.getUserSession(sessionId);
    const dynamoContext = JSON.parse(session.dynamoContext);

    const password = bcrypt.hashSync(dynamoContext.parameters.fields.password.stringValue, 10);

    const newUser = {
      email: dynamoContext.parameters.fields.email.stringValue,
      name: dynamoContext.parameters.fields.name.stringValue,
      lastName: dynamoContext.parameters.fields.last_name.stringValue,
      birthday: dynamoContext.parameters.fields.birthday.stringValue,
      password,
      accessToken: '',
    };

    await DynamoHelper.setNewUser(newUser);

    const tripDetais = {
      email: dynamoContext.parameters.fields.email.stringValue,
      initialCity: dynamoContext.parameters.fields.city.stringValue,
      initialCountry: dynamoContext.parameters.fields.country.stringValue,
      startTripDate: dynamoContext.parameters.fields.trip_date.structValye.fields.startDate,
      endTripDate: dynamoContext.parameters.fields.trip_date.structValye.fields.endDate,
    };

    await TripHelper.buildTrip(tripDetais);

    dialogflowResult.push({text: 'Pronto! :) Preparei coisas bem legais pra você. Só um minutinho...'});
  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Ops, tive um probleminha para salvar sua viagem. Por favor, tente novamente mais tarde.'});
  }
  
  return dialogflowResult;

};

module.exports = SuccessSignupIntent;

