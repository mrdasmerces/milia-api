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
      email: result.parameters.fields.email.stringValue,
    };

    const tripDateValid = await TripHelper.validateTripDates(paramsDate.startDate, paramsDate.endDate, paramsDate.email);

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

    const user = await DynamoHelper.getUser(result.parameters.fields.email.stringValue.toLowerCase());

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
    const isAActualTrip = await TripHelper.isTheCurrentTrip(result.parameters.fields.trip_date.structValue.fields.startDate.stringValue, result.parameters.fields.trip_date.structValue.fields.endDate.stringValue);
    let textConfirmation;
    if(isAActualTrip) {
      textConfirmation = `${result.parameters.fields.name.stringValue}, só confirmando: Você já está em ${result.parameters.fields.country.stringValue} e começou sua viagem no dia ${moment(result.parameters.fields.trip_date.structValue.fields.startDate.stringValue).format('LL')} com volta prevista em ${moment(result.parameters.fields.trip_date.structValue.fields.endDate.stringValue).format('LL')} e vai começar sua trip ${result.parameters.fields.city.stringValue}. Tá tudo certinho?`;
    } else {
      textConfirmation = `${result.parameters.fields.name.stringValue}, só confirmando: Você vai viajar pra ${result.parameters.fields.country.stringValue} no dia ${moment(result.parameters.fields.trip_date.structValue.fields.startDate.stringValue).format('LL')} com volta prevista em ${moment(result.parameters.fields.trip_date.structValue.fields.endDate.stringValue).format('LL')} e vai começar sua viagem em ${result.parameters.fields.city.stringValue}. Tá tudo certinho?`;
    }

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
            title: 'Não, vou arrumar!',
            value: '#signup',
            function: 'newSignup',
            newMessage: 'Vamos recomeçar.',
          },
        ],
      },      
    });
  } catch(e) {
    console.log(e);
    dialogflowResult.push({
      text: 'Ops, me confundi na hora de cadastrar você comigo. Podemos recomeçar, por favor?',
      quickReplies: {
        type: 'radio',
        keepIt: false,
        values: [
          {
            title: 'Continuar cadastro',
            value: '#signup',
            function: 'newSignup',
            newMessage: 'Ok, sem problemas, vamos de novo!',
          },
        ],
      },        
     });
    }
  
  return dialogflowResult;

};

module.exports = SignupIntent;

