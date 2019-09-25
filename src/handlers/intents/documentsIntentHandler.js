'use strict';

const { COUNTRIES_DONT_NEED_PASSPORT, COUNTRIES_NEEDS_VISA } = require('../../models/enum');

const DocumentsIntent = async (result) => {

  const dialogflowResult = [];

  try {
    let country = result.parameters.fields['country'].stringValue;

    if(COUNTRIES_DONT_NEED_PASSPORT.includes(country)) {
      dialogflowResult.push({text: `MARAVILHOSO! Pra entrar em ${country} você não precisa de passaporte. Basta seu RG válido!`});
    } else {
      dialogflowResult.push({text: `Você precisa de um passaporte válido pra entrar em ${country}. Fique atento, pois alguns países exigem uma validade mínima no período da sua viagem. De um google :)`});
    }

    if(COUNTRIES_NEEDS_VISA.includes(country)) {
      dialogflowResult.push({text: `Ops, você vai precisar de um visto de turista. Entre já no site do consulado do seu país de destino (${country}) e veja como tirar o visto.`});
    } else {
      dialogflowResult.push({text: `Boa notícia! Você não precisa de nenhum visto. Porém, você precisa de um seguro viagem. Faça um pra não ter dor de cabeças na imigração :)`});
    }
    
    dialogflowResult.push({text: `Uma boa dica para não ter erro é não esquecer de conferir os certificados e vacinas exigidos. Isso é bem simples de fazer — basta consultar no site da ANVISA para viajantes: https://civnet.anvisa.gov.br/app/viajante`});

  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Pode repetir por favor?'});
  }
  
  return dialogflowResult;

};

module.exports = DocumentsIntent;

