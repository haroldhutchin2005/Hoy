const fs = require('fs');
const path = require('path');

module.exports = {
  name: "changeprefix",
  hasPermission: "adminbot",
  Programmer: "Jonell Magallanes",
  info: "Command to change the bot's prefix",
  usages: "changeprefix [new prefix]",
  cooldowns: 5,
  prefix: "enable",
  letStart: async function({ api, event, target }) {
    const newPrefix = target[0];
    if (!newPrefix) {
      return api.sendMessage("Please specify the new prefix.", event.threadID);
    }
    global.harold.prefix = newPrefix;

    const configPath = path.join(__dirname, '..', '..', 'config.json');
    const config = require(configPath);
    config.prefix = newPrefix;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    api.sendMessage(`The Prefix changed to ${newPrefix}. The bot will now restart to apply changes.`, event.threadID);

    // Countdown for restart in console
    console.log('Bot will restart in 3 seconds...');
    for (let i = 3; i > 0; i--) {
      setTimeout(() => {
        api.sendMessage(`Restarting in ${i}...`, event.threadID);
        console.log(i);
      }, (3 - i) * 1000);
    }

    setTimeout(() => {
      require('child_process').execSync("npm run restart");
    }, 3000);
  }
};