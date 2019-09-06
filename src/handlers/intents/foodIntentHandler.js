'use strict';

const addressService = require('../../services/address');
const foodService = require('../../services/food');
const translateService = require('../../services/translate');
const { COUNTRY, BUTTOM_DOWNLOAD_TEMPLATE } = require('../../models/enum');

const FoodIntent = async (result, paramsUser, originChannel) => {

  const dialogflowResult = [];

  try {
    if(!paramsUser.lastPosition && originChannel != 'App') {
      dialogflowResult.push({
        template: BUTTOM_DOWNLOAD_TEMPLATE,
      });

      return dialogflowResult;
    }

    const lastUserLocation = JSON.parse(paramsUser.lastPosition);
    const address = await addressService(lastUserLocation.coords.latitude, lastUserLocation.coords.longitude);

    const countryCode = address.data.results[0].formatted_address.substring(address.data.results[0].formatted_address.lastIndexOf(',')+2)
    let nationality = '';

    if (COUNTRY[countryCode]) {
      nationality = COUNTRY[countryCode];
    } else {
      nationality = 'Unknown';
    }

    const foods = await foodService(nationality);

    dialogflowResult.push({
      text: `Dê uma olhadas nessas comidas de onde você está agora:`,
    });

    foods.data.meals.sort(() => Math.random() - 0.5);
    foods.data.meals = foods.data.meals.slice(0, 3);

    for(const meal of foods.data.meals) {
      dialogflowResult.push({
        text: await translateService(meal.strMeal, 'pt-BR'),
        image: meal.strMealThumb,
      });
    };

    dialogflowResult.push({
      text: `Que tal achar agora algum restaurante pra comer alguma dessas delícias?`,
      quickReplies: {
        type: 'radio',
        keepIt: true,
        values: [
          {
            title: 'Nhamm! Sim!',
            value: 'findAPlace',
            function: 'findAPlace',
            newMessage: 'Quero comer agora!',
          },
          {
            title: 'Não, talvez depois.',
            value: 'no',
            function: 'findAPlace',
            newMessage: 'Não, talvez depois.',
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

module.exports = FoodIntent;

