const axios = require("axios");

module.exports = {
  name: "gemini",
  hasPermission: "members",
  Programmer: "Jonell Magallanes and hazzey",
  info: "( 𝙶𝚎𝚖𝚒𝚗𝚒 𝙿𝚛𝚘 𝚅𝚒𝚜𝚒𝚘𝚗 )",
  category: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
  usage: "( 𝙼𝚘𝚍𝚎𝚕 - 𝙶𝚎𝚖𝚒𝚗𝚒 𝙿𝚛𝚘 𝚅𝚒𝚜𝚒𝚘𝚗 )",
  cooldown: 3,

  convertImageToCaption: async function (imageURL, api, event) {
    try {
      api.sendMessage("🕟 | 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙸 𝚁𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚒𝚗𝚐 𝙸𝚖𝚊𝚐𝚎, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", event.threadID, event.messageID);

      const response = await axios.get(`https://hazee-gemini-pro-vision-12174af6c652.herokuapp.com/gemini-vision?text=&image_url=${encodeURIComponent(imageURL)}`);
      const caption = response.data.response;

      if (caption) {
        api.sendMessage(`🎓 𝐆𝐞𝐦𝐢𝐧𝐢 𝐏-𝐕𝐢𝐬𝐢𝐨𝐧 ( 𝐀𝐈 )\n\n${caption}`, event.threadID, event.messageID);
      } else {
        api.sendMessage("🤖 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚛𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚎𝚍 𝚝𝚑𝚎 𝚒𝚖𝚊𝚐𝚎𝚜.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("🤖 𝙴𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚛𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎:", error);
      api.sendMessage("🤖 𝙰𝚗 𝙴𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚛𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎.", event.threadID, event.messageID);
    }
  },

  noPrefix: async function ({ api, event }) {
    if (!(event.body.toLowerCase().startsWith("gemini"))) return;

    const args = event.body.split(/\s+/);
    args.shift();

    if (event.type === "message_reply") {
      if (event.messageReply.attachments[0]) {
        const attachment = event.messageReply.attachments[0];

        if (attachment.type === "photo") {
          const imageURL = attachment.url;
          this.convertImageToCaption(imageURL, api, event);
          return;
        }
      }
    }

    const inputText = args.join(' ');

    if (!inputText) {
      return api.sendMessage("🐱 𝙷𝚎𝚕𝚕𝚘 𝙸 𝚊𝚖 𝙶𝚎𝚖𝚒𝚗𝚒 𝙿𝚛𝚘 𝚅𝚒𝚜𝚒𝚘𝚗 𝚝𝚛𝚊𝚒𝚗𝚎𝚍 𝚋𝚢 𝙶𝚘𝚘𝚐𝚕𝚎\n\n𝙷𝚘𝚠 𝚖𝚊𝚢 𝚒 𝚊𝚜𝚜𝚒𝚜𝚝 𝚢𝚘𝚞 𝚝𝚘𝚍𝚊𝚢?", event.threadID);
    }

    api.sendMessage("🗨️ | 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙸 𝚒𝚜 𝚝𝚑𝚒𝚗𝚔𝚒𝚗𝚐, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", event.threadID, event.messageID);

    try {
      const response = await axios.get(`https://hazee-gemini-pro-vision-12174af6c652.herokuapp.com/gemini-vision?text=${encodeURIComponent(inputText)}`);
      if (response.status === 200 && response.data.response) {
        api.sendMessage(`🎓 𝐆𝐞𝐦𝐢𝐧𝐢 𝐏-𝐕𝐢𝐬𝐢𝐨𝐧 ( 𝐀𝐈 )\n\n🖋️ 𝙰𝚜𝚔: '${inputText}'\n\n${response.data.response}`, event.threadID, event.messageID);
      } else {
        console.error("🤖 𝙴𝚛𝚛𝚘𝚛 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎 𝙵𝚛𝚘𝚖 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙿𝙸.");
      }
    } catch (error) {
      console.error("🤖 𝙴𝚛𝚛𝚘𝚛:", error);
      api.sendMessage("🤖 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙿𝙸.", event.threadID, event.messageID);
    }
  },

  letStart: async function ({ api, event }) {
  }
};
