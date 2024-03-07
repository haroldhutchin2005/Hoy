 module.exports = {
  name: "feature",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "View Bot Features of Hutchins Bot",
  prefix: "enable",
  category: "others",
  cooldowns: 10,

  letStart: async function ({api, event,}) { api.sendMessage(`Features of Hutchins BOT 1.0.0V\n\n•Auto Download TikTok\n\n•Auto Download Google Drive Link\n\n•Auto Download Youtube Video\n\n•Auto Download Facebook Video\n\nThis Features When the User Put the or send the of this Link`, event.threadID, event.messageID); }
}