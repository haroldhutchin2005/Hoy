const fs = require('fs');

module.exports = {
  name: "dstatus",
  Programmer: "Jonell Magallanes",
  hasPermission: "members",
  info: "Status Downloader Updated on Hutchins Bot 1.1v",
  prefix: "?",
  category: "Status",
  usages: "dstatus",
  cooldowns: 10,

  letStart: async function ({ api, event }) {
    try {
      const configFile = fs.readFileSync('./config.json', 'utf-8');
      const config = JSON.parse(configFile);

      const mentionedDownloaders = ['tiktok', 'youtube', 'instagram', 'facebook', 'pastebincatcher'];

      const statusMessage = mentionedDownloaders.map(downloader => {
        const status = global.harold[downloader] ? '𝗢𝗻' : '𝗢𝗳𝗳';
        return `${downloader}: ${status}`;
      }).join('\n');

      api.sendMessage(`𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 𝗦𝘁𝗮𝘁𝘂𝘀\n\n${statusMessage}\n\n𝗛𝘂𝘁𝗰𝗵𝗶𝗻𝘀 𝗕𝗼𝘁 1.1`, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error reading 'config.json':", error);
      api.sendMessage("Error reading configuration. Please check the logs.", event.threadID);
    }
  }
};
