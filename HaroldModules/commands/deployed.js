const fs = require('fs');
const path = require('path');

module.exports = {
  name: "deployed",
  hasPermission: "adminbot",
  Programer: "Jonell Magallanes",
  info: "Deploy a command by adding its code.",
  usages: "deployed install [commandCode]",
  category: "system",
  cooldowns: 5,
  prefix: "enable",
  letStart: async function ({ api, event }) {
    const commandSegments = event.body.split(' ');
    if (commandSegments[0] === `${global.harold.prefix}deployed` && commandSegments[1] === 'install' && commandSegments.length > 2) {
      // Extract the code for the new command module from the message
      let commandCode = event.body.substring('?deployed install '.length);

      // Wrap the code with a module.exports if not provided
      if (!commandCode.startsWith(' ')) {
        commandCode = ' ' + commandCode;
      }

      // Create a regex to parse the command name from the code
      const commandNameMatch = /name:\s*"(\w+)"/.exec(commandCode);

      // If there is no match or no command name parsed, return an error
      if (!commandNameMatch) {
        return api.sendMessage('Error: Command code must include a name property.', event.threadID);
      }

      // Get the command name from the regex match
      const commandName = commandNameMatch[1];

      // Define the full path where the command file will be written
      const commandFilePath = path.join(__dirname, `${commandName}.js`);

      // Write the command code to a new file in the commands directory
      fs.writeFile(commandFilePath, commandCode, (err) => {
        if (err) {
          api.sendMessage(`Error while deploying command: ${err.message}`, event.threadID);
        } else {
          api.sendMessage(`Command "${commandName}" has been successfully deployed!`, event.threadID);
        }
      });
    } else {
      api.sendMessage('Invalid command. Use the syntax: ?deployed install [commandCode]', event.threadID);
    }
  }
};