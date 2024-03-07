module.exports = {
  name: "shutdown",
  Programmer: "Jonell Magallanes",
  info: "Shuts down the bot after a 5-second countdown.",
  hasPermission: "admin",
  category: "system",
  usages: "[shutdown]",
  cooldowns: 5,
  dependencies: [],
  prefix: "enable",

  letStart: async function ({ api, event, pushMessage}) {
    pushMessage.send("Bot will shutdown in 3 seconds...", event.threadID);
    for (let i = 3; i > 0; i--) {
      await new Promise(resolve => setTimeout(resolve, 976));
      api.sendMessage(`${i}...`, event.threadID);
    }
    pushMessage.send(`Bot ${global.harold.name} has been shutdown.`, event.threadID);
    console.log('Bot shutdown by administrator.');
    process.exit();
  }
};