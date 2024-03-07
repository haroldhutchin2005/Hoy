const fs = require("fs");
module.exports = {
  name: "meow",
  hasPermission: "members",
  prefix: "disable",
  Programmer: "Jonell Magallanes",
  info: "no prefix",
  category: "No command marks needed",
  usages: "?",
  cooldowns: 5,

  noPrefix({ api, event }) {
    var { threadID, messageID } = event;
    const meows = ["meow", "moew", "pusa"];
    let lowerCaseMeows = [];
    meows.forEach(meow => {
      lowerCaseMeows.push(meow.toLowerCase());
    });

    if (lowerCaseMeows.some(meowTerm => event.body.toLowerCase().includes(meowTerm))) {
      var msg = {
        body: "Meow 😺",
        attachment: fs.createReadStream(__dirname + `/cache/meow.jpg`)
      };
      api.sendMessage(msg, threadID, messageID);
    }
  },

  letStart() {
  }
};