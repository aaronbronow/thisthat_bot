'use strict';
const rp = require('request-promise');
const TELEGRAM_TOKEN = '1273018496:AAEpVb9zTEOEFyTHLx9EefTV2NfH22OOgIs';

async function sendToUser(chat_id, text) {
  const options = {
    method: 'GET',
    uri: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    qs: {
      chat_id,
      text
    }
  };

  return rp(options);
}

module.exports.thisthatbot = async event => {
  const body = JSON.parse(event.body);
  const {chat, text, entities} = body.message;

  var found_command = false;
  var command_length = 0;
  for(var i = 0; i < entities.length; i++) {
    if(entities[i].type == "bot_command") 
      found_command = true;
      command_length = entities[i].length;
  }

  if (text && found_command) {
    let message = '';

    switch(text) {
      case "/start" :
        message = `Hello!`;
      break;
      default:
        let choices = text;
        if(found_command)
          choices = choices.substr(command_length);
        choices = choices.replace('?','').split('or');
        let rand = Math.floor(Math.random() * choices.length);
        let result = choices[rand].trim();
        message = `Let's go with ${result}.`; 
    }

    await sendToUser(chat.id, message);
  } else {
    await sendToUser(chat.id, 'Text message is expected.');
  }

  return { statusCode: 200 };
};
