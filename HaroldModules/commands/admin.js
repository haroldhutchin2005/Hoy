const fs = require('fs');

module.exports = {
  name: "admin",
  Programmer: "Jonell Magallanes",
  info: "Shows the list of admin users based on config.json",
  hasPermission: "admin",
  category: "admin",
  usages: "none",
  cooldowns: 5,
  prefix: "disable",

  letStart: async function({ api, event }) {
    const config = JSON.parse(fs.readFileSync('config.json', { encoding: 'utf8' }));
    const adminUids = global.harold.adminbot || [];

    if (adminUids.length === 0) {
      api.sendMessage("Admin bot list is empty.", event.threadID);
      return;
    }

    let msg = "List of admin bot users:\n";
    for (const uid of adminUids) {
      try {
        const userInfo = await api.getUserInfo(uid);
        const userName = userInfo[uid].name || "Name not found";
        msg += `- ${userName} (${uid})\n`;
      } catch (error) {
        msg += `----------`;
        console.error("Error fetching", error);
      }
    }
    api.sendMessage(msg.trim(), event.threadID);
  }
};