module.exports = {
  name: "shoti",
  hasPermission: "members",
  Programmer: "libyzxy0", //Convert into Hutchins Bot
  info: "Generate a random tiktok video.",
  category: "Entertainment",
  usage: "[]",
  prefix: "enable",
  cooldowns: 20,

 letStart: async ({ api, event, target }) => {

  api.setMessageReaction("⏳", event.messageID, (err) => {
     }, true);
api.sendTypingIndicator(event.threadID, true);

  const { messageID, threadID } = event;
  const fs = require("fs");
  const axios = require("axios");
  const request = require("request");
  const prompt = target.join(" ");

  if (!prompt[0]) { api.sendMessage("📫 | Sending Shoti Please wait", threadID, messageID);
    }

 try {
  const response = await axios.post(`https://shoti-server-v2.onrender.com/api/v1/get`, { apikey: `$shoti-1hnsoausjb5isoev45g` });

  const path = __dirname + `/cache/shoti.mp4`;
  const file = fs.createWriteStream(path);
  const rqs = request(encodeURI(response.data.data.url));
  rqs.pipe(file);
  file.on(`finish`, () => {
     setTimeout(function() {
       api.setMessageReaction("✅", event.messageID, (err) => {
          }, true);
      return api.sendMessage({
      body: `Downloaded Successfull(y). \n\nuserName : \n\n@${response.data.data.user.username} \n\nuserNickname : \n\n${response.data.data.user.nickname} \n\nuserID : \n\n${response.data.data.user.userID} \n\nDuration : \n\n${response.data.data.duration}`, 
      attachment: fs.createReadStream(path)
    }, threadID);
      }, 5000);
        });
  file.on(`error`, (err) => {
      api.sendMessage(`Error: ${err}`, threadID, messageID);
  });
   } catch (err) {
    api.sendMessage(`Error: ${err}`, threadID, messageID);
  };
}
}