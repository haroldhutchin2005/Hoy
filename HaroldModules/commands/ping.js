module.exports = {
  name: "ping",
  Programmer: "Jonell Magallanes",
  info: "Responds with pong and latency",
  usages: "",
  hasPermission: "members",
  prefix: "disable",
  cooldowns: 10,
  letStart: async function ({ api, event }) {
    const startTime = Date.now();
    api.sendMessage('Pong!', event.threadID, (error, messageInfo) => {
      if (error) return console.error(error);
      const endTime = Date.now();
      const latency = endTime - startTime;
      api.sendMessage(`Pong! Latency: ${latency}ms`, event.threadID, messageInfo.messageID);
    });
  }
};