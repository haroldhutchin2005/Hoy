const fs = require("fs-extra");

module.exports = {
  name: "sendnoti", hasPermission: "adminbot",
  Programer: "Jonell Magallanes",
  info: "Send a notification to all group chats",
  usages: "sendnoti {message}",
  prefix: 'disable',
  cooldowns: 30,
  letStart: async function({ api, event, Threads }) {
    const input = event.body;
    const text = input.substring(input.indexOf(' ') + 1);

    if (!input.startsWith('sendnoti ') || text === " ") {
      return api.sendMessage("Please enter a notification message.", event.threadID);
    }
    
    let senderInfo = await api.getUserInfo(event.senderID);
    let senderName = senderInfo[event.senderID].name;

    let notificationMessage = `𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗙𝗥𝗢𝗠 𝗠𝗔𝗜𝗡 𝗦𝗘𝗥𝗩𝗘𝗥\n\n『 ${text.trim()} 』\n\n『 ADMINBOT 』:${senderName}`;

    try {
      let threads = await api.getThreadList(500, null, ['INBOX']); // get 500 threads
      let threadIDs = threads.map(thread => thread.threadID);
      threadIDs.forEach(id => {
        api.sendMessage(notificationMessage, id);
      });

      api.sendMessage(`Notification sent to ${threadIDs.length} threads.`, event.threadID);
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('An error occurred while sending the notifications.', event.threadID);
    }
  }
};
