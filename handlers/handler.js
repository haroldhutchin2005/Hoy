const { readdirSync, createReadStream } = require('fs');
const { join } = require('path');
const chalk = require('chalk');
const config = require('../config.json');
const FormData = require('form-data');
const gradient = require('gradient-string');
const { exec } = require('child_process');
const { EventEmitter } = require('events');

const commandWatcher = new EventEmitter();

const NoPrefix = (eventBody, commands) => {
  return commands.find(command => {
    if (!command.usePrefix && eventBody.startsWith(command.name)) {
      return true;
    }
    return command.aliases && command.aliases.some(alias => eventBody.startsWith(alias));
  });
};

const hasPermission = function (member, chat, commandCategory) {
  switch (commandCategory) {
    case 'anyone':
      return true;
    case 'admin':
      return chat.isGroup && member.isAdmin;
    case 'adminbot':
      return config.adminbot_uid.includes(member.id);
    case 'nsfw':
      return chat.nsfwAllowed;
    default:
      return false;
  }
};

module.exports = {
  NoPrefix,
  hasPermission,

  sendAttachment: function (api, chatId, filePath, fileName) {
    const form = new FormData();
    form.append('file', createReadStream(filePath), fileName);

    api.sendMedia(chatId, form, (err, message) => {
      if (err) {
        console.error(gradient.fruit(`Failed to send attachment: ${err.message}`));
        return;
      }
      console.log(gradient.forest(`Attachment sent, message id: ${message.message_id}`));
    });
  },

  loadCommand: function (api, commandsPath, usePrefix) {
    api.commands = api.commands || {};
    readdirSync(commandsPath)
      .filter(file => file.endsWith('.js'))
      .forEach(file => {
        let command = require(join(commandsPath, file));
        command.usePrefix = usePrefix;
        if (api.commands[command.name]) {
          delete require.cache[require.resolve(join(commandsPath, file))];
          command = require(join(commandsPath, file)); // refresh command module
        }
        api.commands[command.name] = command;
        console.log(gradient.instagram(`COMMAND DEPLOYED ➜ 『 ${command.name} 』`));
        commandWatcher.emit('commandLoaded', command);
      });
    commandWatcher.on('commandLoaded', command => {
      // Command loaded logic here
    });
  },

  loadEvents: function (api, eventsPath) {
    api.events = api.events || {};
    readdirSync(eventsPath)
      .filter(file => file.endsWith('.js'))
      .forEach(file => {
        const eventName = file.replace('.js', '');
        api.events[eventName] = require(join(eventsPath, file));
        console.log(gradient.instagram(`EVENT COMMAND DEPLOYED ➜ 』 ${eventName} 』`));
      });
  },

  loadCommands: function (commandName, member, chat, api) {
    let command = api.commands[commandName];
    if (!command) {
      api.sendMessage(`Command not found: ${commandName}`, chat.id);
      return;
    }

    let isBotAdmin = config.bot_admin.includes(member.id);

    if (!hasPermission(member, chat, command.category)) {
      let message;
      switch (command.category) {
        case 'admin':
        case 'adminbot':
          message = `You do not have permission to execute this command: ${commandName}`;
          break;
        case 'nsfw':
          message = `This thread isn't allowed NSFW commands. You need to turn on NSFW to execute the command: ${commandName}`;
          break;
        default:
          message = `You can't execute this command: ${commandName}`;
          break;
      }
      api.sendMessage(message, chat.id);
    } else {
      command.letStart(api, member, chat);
    }
  },

  handleUnsend: function(api, event) {
    // When someone unsends a message, check if the bot sent it, then delete the bot's message
    if(event.logMessageType === "message_unsend") {
      const messageID = event.logMessageData.messageID;
      api.getThreadHistory(event.threadID, 10, undefined, (err, history) => {
        if(err) {
          console.error(err);
          return;
        }
        const botMessage = history.find(m => m.messageID === messageID);
        if(botMessage && botMessage.senderID === api.getCurrentUserID()) {
          api.unsendMessage(messageID);
        }
      });
    }
  }
};

// Real-time command monitoring logic could be added based on specific requirements here
// The 'commandWatcher' EventEmitter could be extended to listen and act upon command usage or updates.