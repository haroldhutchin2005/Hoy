const axios = require("axios");
const fs = require("fs");

module.exports = {
  name: "bard",
  programmer: "Jonell Magallanes",
  info: "Bard ai",
  hasPermission: "members",
  category: "ai",
  usages: "<ask>",
  cooldowns: 30,
  prefix: "disable",
  letStart: async function ({ api, event, target, pushMessage }) {
    const { threadID, messageID, type, messageReply, body } = event;

const content = encodeURIComponent(target.join(" "));
    
    if (type === "message_reply" && messageReply.attachments && messageReply.attachments[0].type === "photo") {
      const attachment = messageReply.attachments[0];
      const imageURL = attachment.url;
      question = await convertImageToText(imageURL);

      if (!content) {
        pushMessage.reply(
          "❌ Failed to convert the photo to text. Please try again with a clearer photo.",
          threadID,
          messageID
        );
        return;
      }
    } else {
      target = body.slice(this.prefix.length + this.name.length + 1).trim();

      if (!content) {
        pushMessage.reply("Please provide a question or query", threadID, messageID);
        return;
      }
    }

    pusMessage.reply("Searching for an answer, please wait...", threadID, messageID);

    try {
      const res = await axios.get(
        `https://bard.kimjosephdgbien.repl.co/api?ask=${encodeURIComponent(content)}`
      );

      const respond = res.data.message;
      const imageUrls = res.data.imageUrls;

      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const attachments = [];

        if (!fs.existsSync("cache")) {
          fs.mkdirSync("cache");
        }

        for (let i = 0; i < imageUrls.length; i++) {
          const url = imageUrls[i];
          const imagePath = `cache/image${i + 1}.png`;

          try {
            const imageResponse = await axios.get(url, { responseType: "arraybuffer" });
            fs.writeFileSync(imagePath, imageResponse.data);

            attachments.push(fs.createReadStream(imagePath));
          } catch (error) {
            console.error("Error occurred while downloading and saving the image:", error);
          }
        }

        box.send(
          {
            attachment: attachments,
            body: respond
          },
          threadID,
          messageID
        );
      } else {
        box.send(respond, threadID, messageID);
      }
    } catch (error) {
      console.error("Error occurred while fetching data from the Bard API:", error);
      pushMessage.reply("An error occurred while fetching data. Please try again later.", threadID, messageID);
    }
  }
};

async function convertImageToText(imageURL) {
  const response = await axios.get(
    `https://marjhunapis.fujibot.repl.co/api/?question=${encodeURIComponent(imageURL)}`
  );
  return response.data.extractedText;
}