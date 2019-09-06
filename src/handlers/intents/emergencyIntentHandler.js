'use strict';

const addressService = require('../../services/address');
const emergencyService = require('../../services/emergency');
const { BUTTOM_DOWNLOAD_TEMPLATE } = require('../../models/enum');

const EmergencyIntent = async (result, paramsUser, originChannel) => {

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

    let countryCode = '';
    for(const adressData of address.data.results) {
      if (adressData.types.includes('country')) {
        countryCode = adressData.address_components[0].short_name;
        break;
      }
    }

    const emergencyNumbers = await emergencyService(countryCode);

    let emergencyNumbersText = '';
    if (!emergencyNumbers.data.data.ambulance.all.includes("")) emergencyNumbersText += `Ambulância: ${emergencyNumbers.data.data.ambulance.all[0]}.`;
    if (!emergencyNumbers.data.data.police.all.includes("")) emergencyNumbersText += ` Polícia: ${emergencyNumbers.data.data.police.all[0]}.`;
    if (!emergencyNumbers.data.data.fire.all.includes("")) emergencyNumbersText += ` Bombeiros: ${emergencyNumbers.data.data.fire.all[0]}.`;
    if (!emergencyNumbers.data.data.dispatch.all.includes("")) emergencyNumbersText += ` Denúncia: ${emergencyNumbers.data.data.dispatch.all[0]}.`;

    if(!emergencyNumbersText) throw new Error('Nenhum telefone de emergência encontrado');
    
    dialogflowResult.push({text: `Ops, parece que você está com problemas! Mantenha a calma. Veja pra onde você pode ligar pra te ajudar:`});
    dialogflowResult.push({text: emergencyNumbersText});

  } catch(e) {
    console.log(e);
    dialogflowResult.push({text: 'Desculpe, não consegui te ajudar agora :( Procure ajude com pessoas próximas a você, ou procure uma autoridade!'});
  }
  
  return dialogflowResult;

};

module.exports = EmergencyIntent;

