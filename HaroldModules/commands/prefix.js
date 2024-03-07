const fs = require("fs");

module.exports = {
  name: "prefixsf",
  hasPermission: "members",
  Programmer: "John Arida", 
  info: "no prefix",
  category: "No command marks needed",
  prefix: "enable",
  usages: "...",
  cooldowns: 1, 
  async letStart({ api, event, box }) {
    var { threadID, messageID } = event;
    const commandBody = event.body.toLowerCase().trim();
    if (commandBody === "prefix" || commandBody === "ano prefix") {
      const moment = require("moment-timezone");
      var gio = moment.tz("Asia/Manila").format("HH:mm:ss || D/MM/YYYY");
      var msg = {
        body: `My Current Prefix » ${global.harold.prefix} \n Type ${global.harold.prefix}help to see all commands.\n\nTime: ${gio}`
      };
      api.sendMessage(msg, threadID, messageID);
    }
  },
async noPrefix ({ api, event, box }) {
  var { threadID, messageID } = event;
  const commandBody = event.body.toLowerCase().trim();
  if (commandBody === "prefix" || commandBody === "ano prefix") {
    const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Manila").format("HH:mm:ss || D/MM/YYYY");
    var msg = {
      body: `My Current Prefix » ${global.harold.prefix} \n Type ${global.harold.prefix}help to see all commands.\n\nTime: ${gio}`
    };
    api.sendMessage(msg, threadID, messageID);
  }
}
}