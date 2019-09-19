'use strict';

const DynamoHelper      = require('../../helpers/dynamodb')
const TripHelper      = require('../../helpers/triphelper')

const moment = require('moment');
moment.locale('pt-BR');

const SignupIntent = async (result, sessionId) => {

  const dialogflowResult = [];

  try {
    await DynamoHelper.updateSession(sessionId, JSON.stringify(result));

    const paramsDate = {
      startDate: result.parameters.fields.trip_date.structValue.fields.startDate.stringValue,
      endDate: result.parameters.fields.trip_date.structValue.fields.endDate.stringValue,
      email: result.parameters.fields.trip_date.email.stringValue,
    };

    const tripDateValid = await TripHelper.validateTripDates(paramsDate.startDate, paramsDate.endDate, email);

    if(!tripDateValid) {
      dialogflowResult.push({
        text: 'Ops, há um problema com as datas da sua viagem!',
        quickReplies: {
          type: 'radio',
          keepIt: false,
          values: [
            {
              title: 'Corrigir datas',
              value: '#signup',
              function: 'newSignup',
              newMessage: 'Vamos corrigir essas datas!',
            },
          ],
        },        
       });
 
       return dialogflowResult;      
    }

    const user = await DynamoHelper.getUser(result.parameters.fields.email.stringValue);

    if(user) {
      dialogflowResult.push({
       text: 'Ops, parece que já existe um cadastro com esse email. O que você gostaria de fazer?',
       quickReplies: {
        type: 'radio',
        keepIt: false,
        values: [
          {
            title: 'Alterar senha',
            value: '#forgot_pasword',
            function: 'forgotPassword',
            newMessage: 'Quero alterar a senha.',
          },
          {
            title: 'Fazer novo cadastro',
            value: '#signup',
            function: 'newSignup',
            newMessage: 'Quero fazer um novo cadastro.',
          },
        ],
      },
      });

      return dialogflowResult;
    }

    //colocar tempos verbais correto de acordo com as datas da viagem
    const textConfirmation = `${result.parameters.fields.name.stringValue}, só confirmando: Você vai viajar pra ${result.parameters.fields.country.stringValue} no dia ${moment(result.parameters.fields.trip_date.structValue.fields.startDate.stringValue).format('LL')} com volta prevista em ${moment(result.parameters.fields.trip_date.structValue.fields.endDate.stringValue).format('LL')} e vai começar sua viagem em ${result.parameters.fields.city.stringValue}. Tá tudo certinho?`;

    dialogflowResult.push({
      text: textConfirmation,
      quickReplies: {
        type: 'radio',
        keepIt: false,
        values: [
          {
            title: 'Sim! Vamos nessa!',
            value: '#success_signup',
            function: 'successSignup',
            newMessage: 'Tudo certo, estou pronto!',
          },
          {
            title: 'Não, você não entendeu direito >:(',
            value: '#signup',
            function: 'newSignup',
            newMessage: 'Vamos recomeçar.',
          },
        ],
      },      
    });
  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = SignupIntent;

