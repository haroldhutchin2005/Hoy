module.exports = {
  name: "restart",
  hasPermission: "adminbot",
  Programmer: "manhIT",
  info: "Restart the Bot",
  prefix: "enable",
  category: "system",
  usages: "",
  cooldowns: 5,

  letStart: async function({ api, event, }) {
    const { threadID, messageID } = event;
    return api.sendMessage(`${global.harold.name} BOT has been Restart Please Waittt`, threadID, () => process.exit(1));
  }
};