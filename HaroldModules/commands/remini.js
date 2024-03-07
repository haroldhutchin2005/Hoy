const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  name: "remini",
  hasPermission: "members",
  Programmer: "Mark Hitsuraan",
  info: "Enhancer",
  category: "no prefix",
  prefix: "enable",
  usages: "Enhance an image",
  cooldowns: 2,

  letStart: async function ({ api, event }) {
    const args = event.body.split(/\s+/).slice(1); // Exclude the command

    if (!(args[0] === "remini" || args[0] === "Remini")) return;

    const pathie = path.join(__dirname, 'cache', 'zombie.jpg');
    const { threadID, messageID, messageReply } = event;

    // Use event.messageReply directly for getting image URL
    const photoUrl = messageReply.attachments[0]?.url || args.slice(1).join(" ");

    if (!photoUrl) {
      api.sendMessage("Please reply to an image to proceed enhancing.", threadID, messageID);
      return;
    }

    const content = encodeURIComponent(args.join(" "));

    if (!content) {
      api.sendMessage("Invalid content, please provide a valid image URL.", threadID, messageID);
      return;
    }

    api.sendMessage("Enhancing, please wait a moment...", threadID, async () => {
      try {
        const response = await axios.get(`https://allinoneapis.onrender.com/api/try/remini?url=${content}`);
        const processedImageURL = response.data.image_data;
        const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

        fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

        api.sendMessage({
          body: "Enhanced Successfully!",
          attachment: fs.createReadStream(pathie)
        }, threadID, () => fs.unlinkSync(pathie), messageID);
      } catch (error) {
        api.sendMessage(`Error processing image: ${error}`, threadID, messageID);
      }
    });
  },
};
