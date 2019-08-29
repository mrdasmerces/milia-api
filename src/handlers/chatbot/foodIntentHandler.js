'use strict';

const addressService = require('../../services/address');
const foodService = require('../../services/food');
const translateService = require('../../services/translate');
const { COUNTRY } = require('../../models/enum');

const FoodIntent = async (result, paramsUser) => {

  const dialogflowResult = [];

  try {
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
      text: `Que tal achar agora algum restaurante perto de você pra comer alguma dessas delícias?`,
      quickReplies: {
        type: 'radio',
        keepIt: true,
        values: [
          {
            title: 'Nhamm! Sim!',
            value: 'yes',
          },
          {
            title: 'Não, estou sem fome agora :( Talvez depois.',
            value: 'no',
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

