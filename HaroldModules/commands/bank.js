const path = require('path');
const fs = require('fs');

module.exports = {
  name: "bank",
  Programmer: "Jonell Magallanes",
  info: "Allows a user to check their bank currency balance",
  hasPermission: "members",
  category: "economy",
  usages: "bank",
  cooldowns: 5,
  prefix: "enable",

  letStart: async function({ api, event, pushMessage }) {
    const userId = Object.keys(event.mentions).length === 0 ? event.senderID : Object.keys(event.mentions)[0];
    const userDataFile = path.join(__dirname, 'currencies.json');
    let userData = JSON.parse(fs.readFileSync(userDataFile, { encoding: 'utf8' }));

    if (!userData[userId]) {
      pushMessage.reply("You do not have an account yet.", event.threadID);
      return;
    }

    const balance = userData[userId].balance || 0;
    let message;
    if (Object.keys(event.mentions).length > 0) {
      const mentionName = event.mentions[userId];
      message = `🏦 | Name: ${mentionName.replace('@', '')} \n\n━━━━━━━━━━━━━━━━━\n\nYour current balance is $${balance}.`;
    } else {
      message = `🏦 | Your current balance is $${balance}.`;
    }
   pushMessage.reply(message, event.threadID);
  }
};