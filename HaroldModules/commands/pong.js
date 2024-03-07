module.exports = {
  name: "pong",
  hasPermission: "members",
  Programmer: "Yenzy",
  info: "Checking Ping",
  usage: "ping",
  prefix: "disable",
  category: "ADMIN",
  cooldowns: 0,

// Start Execution
letStart: async ({ api, event }) => {
 try {
   const timeStart = Date.now();
   const ping = Date.now() - timeStart;
    // End Of Execution
    await api.sendMessage(`Ping! ${ping}ms`, event.threadID);
  } catch (error) {
    api.sendMessage("Pong! Unable to send message", event.threadID);
  }
}
}

