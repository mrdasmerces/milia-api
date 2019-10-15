'use strict';

const { countryCodeService } = require('../../services/address');
const foodService = require('../../services/food');
const translateService = require('../../services/translate');
const { COUNTRY } = require('../../models/enum');
const { removeAcento } = require('../../utils/remove-acento')

const FoodIntent = async (result, paramsUser) => {

  const dialogflowResult = [];

  try {
    let country = result.parameters.fields['geo-country'].stringValue;
    country = removeAcento(country);
    const address = await countryCodeService(country);

    const countryCode = address.data.results[0].address_components[0].short_name;
    let nationality = '';

    if (COUNTRY[countryCode]) {
      nationality = COUNTRY[countryCode];
    } else {
      nationality = 'Unknown';
    }

    const foods = await foodService(nationality);

    dialogflowResult.push({
      text: `Dê uma olhadas nesses pratos:`,
    });

    foods.data.meals.sort(() => Math.random() - 0.5);
    foods.data.meals = foods.data.meals.slice(0, 3);

    for(const meal of foods.data.meals) {
      dialogflowResult.push({
        text: await translateService(meal.strMeal, 'pt-BR'),
        image: meal.strMealThumb,
      });
    };

    if(paramsUser.lastPosition) {
      dialogflowResult.push({
        text: `Que tal achar agora algum restaurante pra comer alguma dessas delícias?`,
        quickReplies: {
          type: 'radio',
          keepIt: false,
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
    }


  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = FoodIntent;

