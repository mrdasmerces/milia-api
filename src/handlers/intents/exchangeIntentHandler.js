'use strict';

const exchangeService = require('../../services/exchange');

const ExchangeIntent = async (result) => {

  const dialogflowResult = [];

  try {
    const base = result.parameters.fields['EXCHANGE'].stringValue.toUpperCase();
    const number = result.parameters.fields['number'].numberValue;

    const resultExchange = await exchangeService(base);

    const valueBefore = new Intl.NumberFormat('nu', { style: 'currency', currency: base }).format(number);
    const valueExchange = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultExchange.data.rates.BRL * number);

    dialogflowResult.push({text: `Segundo o Banco Central Europeu, a cotação de ${valueBefore} hoje é de ${valueExchange}`});
  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Que tal falar de outra forma?'});
  }
  
  return dialogflowResult;

};

module.exports = ExchangeIntent;

