'use strict';

const LANGUAGES = {
  italiano: 'it',
  arabe: 'ar',
  árabe: 'ar',
  búlgaro: 'ar',
  bulgaro: 'ar',
  checo: 'cs',
  dinamarquês: 'da',
  dinamarques: 'da',
  holandês: 'nl',
  holandes: 'nl',
  inglês: 'en',
  ingles: 'en',
  finlandês: 'fi',
  finlandes: 'fi',
  francês: 'fr',
  frances: 'fr',
  alemão: 'de',
  alemao: 'de',
  grego: 'el',
  hebraico: 'he',
  hindi: 'hi',
  húngaro: 'hu',
  hungaro: 'hu',
  indonésio: 'id',
  indonesio: 'id',
  japonês: 'ja',
  japones: 'ja',
  coreano: 'co',
  norueguês:'no',
  noruegues:'no',
  polonês: 'pl',
  polones: 'pl',
  romeno: 'ro',
  russo: 'ru',
  chinês: 'zh',
  chines: 'zh',
  espanhol: 'es',
  sueco: 'sv',
  tailandês: 'th',
  tailandes: 'th',
  turco: 'tr',
  vietinamita: 'vi',
}

const COUNTRY = {
  USA: 'American',
  ITA: 'Italian',
  GBR: 'British',
  CAN: 'Canadian',
  CHN: 'Chinese',
  NLD: 'Dutch',
  EGY: 'Egyptian',
  FRA: 'French',
  GRC: 'Greek',
  IND: 'Indian',
  IRL: 'Irish',
  JAM: 'Jamaican',
  JPN: 'Japanese',
  KEN: 'Kenyan',
  MYS: 'Malaysian',
  MEX: 'Mexican',
  RUS: 'Russian',
  ESP: 'Spanish',
  THA: 'Thai',
  TUN: 'Tunisian',
  TUR: 'Turkish',
  VNM: 'Vietnamese'
}

const BUTTOM_DOWNLOAD_TEMPLATE = {
  payload: {
    template_type: "button",
    text:" Eu posso te ajudar com isso, mas somente através do meu aplicativo. Dê uma olhada na loja e faça o download :)",
    buttons: [
      {
        type: "web_url",
        url: "https://www.messenger.com",
        title: "Download IOS"
      },
      {
        type: "web_url",
        url: "https://www.messenger.com",
        title: "Download Android"
      },
    ]
  }
};

module.exports = {
  LANGUAGES,
  COUNTRY,
  BUTTOM_DOWNLOAD_TEMPLATE,
};