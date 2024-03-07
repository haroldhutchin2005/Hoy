const axios = require("axios");
const fs = require("fs");
const cheerio = require('cheerio'); 

module.exports = {
  name: "paste",
  Programer: "Jonell Magallanes",
  info: "Uploads command code to Pastebin and returns a raw link",
  usages: "?paste [command name]",
  hasPermission: "members",
  prefix: 'disable',
  cooldowns: 5,
  letStart: async function ({ api, event }) {
    const args = event.body.trim().split(/\s+/);

    if (args.length < 2) {
      return api.sendMessage("Please provide the name of the command you want to upload.", event.threadID);
    }

    const commandName = args[1]; 
    const commandFilePath = `${__dirname}/../commands/${commandName}.js`; // Adjust the path according to your project structure

    try {
      if (!fs.existsSync(commandFilePath)) {
        return api.sendMessage(`Command '${commandName}' not found.`, event.threadID);
      }

      const commandCode = fs.readFileSync(commandFilePath, { encoding: 'utf8' });
      const formData = new URLSearchParams({
        api_dev_key: 'aeGtA7rxefvTnR3AKmYwG-jxMo598whT', // Replace with your actual Pastebin API key
        api_option: 'paste',
        api_paste_code: commandCode,
        api_paste_format: 'javascript',
        api_paste_expire_date: 'N',
        api_paste_name: commandName,
        api_user_key: '' // optional, for registered users
      }).toString();

      const response = await axios.post('https://pastebin.com/api/api_post.php', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const pasteLink = response.data;

      if (pasteLink.startsWith('❓ | Bad API request')) {
        api.sendMessage(`🔨 | Failed to create paste: ${pasteLink}`, event.threadID);
      } else {
        // Extract the paste key from the URL to create a raw link
        const rawPasteLink = `https://pastebin.com/raw/${pasteLink.split("/").pop()}`;
        api.sendMessage(`📝 | Pastebin Command\n\nLink: ${rawPasteLink}`, event.threadID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("🚧 | An error occurred while uploading to Pastebin.", event.threadID);
    }
  }
};