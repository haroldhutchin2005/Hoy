const fs = require('fs');
const path = require('path');

module.exports = {
  name: "cmdinfo",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "Commands info for bot commands",
  category: "Utilities",
  usages: "cmdinfo [CommandName]",
  cooldowns: 5,
  prefix: "disable",
  letStart: async ({ api, event, target }) => {
    const commandName = target[0];
    const commandsFolder = path.join(__dirname, '../commands/');

    if (!commandName) {
      let guideMessage = "Commands guide:\n";
      fs.readdirSync(commandsFolder).forEach(file => {
        if (!file.endsWith('.js')) return;
        let command = require(path.join(commandsFolder, file));
        if (command.name) {
          guideMessage += `• ${command.name}\n`;
        }
      });
      guideMessage += '\nUse !cmdinfo [CommandName] to get detailed information.';
      api.sendMessage(guideMessage, event.threadID);
      return;
    } else {
      let filePath = path.join(commandsFolder, `${commandName}.js`);
      if (fs.existsSync(filePath)) {
        let command = require(filePath);
        let guideMessage = `Details for command: ${commandName}\n` +
          `- Name: ${command.name}\n` +
          `- Programmer: ${command.Programmer}\n` +
          `- Info: ${command.info}\n` +
          `- Category: ${command.category}\n` +
          `- Usages: ${command.usages}\n` +
          `- Cooldowns: ${command.cooldowns} seconds\n`;
        api.sendMessage(guideMessage, event.threadID);
      } else {
        api.sendMessage(`The command '${commandName}' does not exist.`, event.threadID);
      }
    }
  }
};