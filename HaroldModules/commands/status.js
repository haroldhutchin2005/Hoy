const os = require('os');
const { performance } = require('perf_hooks');

module.exports = {
  name: "status",
  hasPermission: "members",
  Programmer: "Jonell Magallanes", 
  info: "Show status of bot",
  category: "utility",
  cooldowns: 5,
  prefix: "enable",

  letStart: async function ({ api, event }) {
    const cpuCores = os.cpus().length;
    const totalRam = (os.totalmem() / (1024 ** 3)).toFixed(2); // convert to GB
    const freeRam = (os.freemem() / (1024 ** 3)).toFixed(2); // convert to GB
    const uptime = os.uptime();
    const botStatus = "online"; // Replace with actual bot status

    api.sendMessage(
      {
        body: `𝖮𝗐𝗇𝖾𝗋 𝗌𝗍𝖺𝗍𝗎𝗌\n\nOS: ${os.type()} ${os.release()}\nCPU Cores: ${cpuCores}\nTotal RAM: ${totalRam} GB\nFree RAM: ${freeRam} GB\nBot Status: ${botStatus}\nUptime: ${uptime} seconds`,
      },
      event.threadID
    );
  },
};