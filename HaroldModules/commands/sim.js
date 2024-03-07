module.exports = {
  name: "sim",
  hasPermission: "members",
  Programmer: "KENLIEPLAYS",
  info: "Talk to sim",
  category: "sim",
  usages: "[ask]",
  cooldowns: 5,
  switch: "on",
  letStart: async function({ api, event, target }) {
    if (event.body !== null && this.switch === "on") {
      const axios = require("axios");
      let { messageID, threadID, senderID, body } = event;
      let tid = threadID,
        mid = messageID;
      const content = encodeURIComponent(target.join(" "));
      if (!target[0]) return api.sendMessage("Please type a message...", tid, mid);
      try {
        const res = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=en&message=${content}&filter=false`);
        const respond = res.data.success;
        if (res.data.error) {
          api.sendMessage(`Error: ${res.data.error}`, tid, (error, info) => {
            if (error) {
              console.error(error);
            }
          }, mid);
        } else {
          api.sendMessage(respond, tid, (error, info) => {
            if (error) {
              console.error(error);
            }
          }, mid);
        }
      } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching the data.", tid, mid);
      }
    } else {
      api.sendMessage("The sim command is currently disabled.", event.threadID);
    }
  }
};