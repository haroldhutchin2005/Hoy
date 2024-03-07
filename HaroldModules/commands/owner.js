const fs = require('fs');
const path = require('path');
const request = require('request');
const os = require('os');

module.exports = {
  name: "owner",
  info: "Show the info of owner",
  hasPermission: "members",
  prefix: "enable",
  category: "info",
  cooldowns: 5,
  letStart: function ({ api, event }) {
    const imageUrl = "https://i.postimg.cc/ZqfGHVJr/New-Project-1241-1402-BBE.png";
    const imagePath = path.join(__dirname, 'cache', 'ownerInfo.png');

    fs.mkdirSync(path.dirname(imagePath), { recursive: true });
    const imageStream = fs.createWriteStream(imagePath);
    request(imageUrl).pipe(imageStream).on('close', () => {
      const uptimeInSeconds = process.uptime();
      const uptimeFormatted = formatUptime(uptimeInSeconds);

      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();

      api.sendMessage(
        {
          body: `𝖮𝗐𝗇𝖾𝗿 𝖮𝖿 𝖧𝗎𝗍𝖼𝗂𝗇𝗌 𝖡𝖮𝖳\n\n𝗡𝗮𝗺𝗲: ${global.harold.owner}\n\n𝗨𝗜𝗗: ${global.harold.adminbot}\n\n𝗟𝗶𝗻𝗸 𝗢𝘄𝗻𝗲𝗿: ${global.harold.ownerlink}\n\nUptime: ${uptimeFormatted}\n\nTotal Memory: ${formatBytes(totalMemory)}\nFree Memory: ${formatBytes(freeMemory)}`,
          attachment: fs.createReadStream(imagePath),
        },
        event.threadID
      );
    });
  },
};

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60);
  const secondsRemainder = Math.floor(((seconds % 86400) % 3600) % 60);

  return `${days}d ${hours}h ${minutes}m ${secondsRemainder}s`;
}

function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i];
}