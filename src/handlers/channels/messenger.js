'use strict';

const axios = require('axios');

const getUserId = async (requestBody) => {
  return requestBody.entry[0].messaging[0].sender.id;
};

const getParametersRequest = async (requestBody) => {
  const paramsUser = { recipientId: requestBody.entry[0].messaging[0].sender.id };
  return { queryText: requestBody.entry[0].messaging[0].message.text, paramsUser };
}

const sendTyping = async (paramsUser) => {
  const messageData = {
    recipient: {
      id: paramsUser.recipientId.toString(),
    },
    sender_action: 'typing_on',
  }

  try {
    const result = await axios.post('https://graph.facebook.com/v4.0/me/messages?access_token=EAAFnwyY8o3wBACdFWLKDCCWTTGLQC4qVkehgO0QzPiVBXJbihcRJ1TZC71gwptrnh1ew8fA3Bcobuzpywf7z15JggWufExR7vT9mSmmx0JHiluX1AUByAZBLDZAYkK7n6LdtNZCZBc6LfyWiazqGiXnjLzf7GuIsFaIaevCj2ZCgZDZD', JSON.stringify(messageData), { 
      headers: {
      'content-type': 'application/json',
      }
    });

    return result;
  } catch(e) {
    console.log(e);
  }  
};

const endMessageRequest = async (dialogflowResult, paramsUser) => {
  const messagesData = [{
    recipient: {
      id: paramsUser.recipientId.toString(),
    },
    sender_action: 'typing_off',
  }];

  for(const message of dialogflowResult) {

    if(message.image) {
      messagesData.push({
        recipient: {
          id: paramsUser.recipientId.toString(),
        },
        message: {
          attachment: {
            type: 'image', 
            payload: {
              url: message.image,
              is_reusable: true
            }        
          }
        },
      });
    }

    const newMessage = {
      recipient: {
        id: paramsUser.recipientId.toString(),
      },
      message: {
        text: message.text,
      },
    };
    
    messagesData.push(newMessage);
  }

  const promiseSerial = messagesData.map(item =>
    axios.post('https://graph.facebook.com/v4.0/me/messages?access_token=EAAFnwyY8o3wBACdFWLKDCCWTTGLQC4qVkehgO0QzPiVBXJbihcRJ1TZC71gwptrnh1ew8fA3Bcobuzpywf7z15JggWufExR7vT9mSmmx0JHiluX1AUByAZBLDZAYkK7n6LdtNZCZBc6LfyWiazqGiXnjLzf7GuIsFaIaevCj2ZCgZDZD', JSON.stringify(item), {
      headers: {
      'content-type': 'application/json',
    }
  }));

  try {
    const result = await Promise.all(promiseSerial);
    return result;
  } catch(e) {
    console.log(e);
  }
}


module.exports = {
  getUserId,
  getParametersRequest,
  endMessageRequest,
  sendTyping
};

