const request = require('request');
const fs = require('fs');

module.exports = {
  name: "tid",
  hasPermission: "members",
  Programer: "NTKhang & Yan Maglinte", // Added a function to get ThreadImage
  info: "Get box id and group image",
  prefix: "enable",
  category: "group",
  usages: "tid",
  cooldowns: 5,

 letStart: async function({ api, event }) {
  let threadInfo = await api.getThreadInfo(event.threadID);
  let { threadName, participantIDs, imageSrc } = threadInfo;

  if (imageSrc) {
    let callback = async function() {
      api.sendMessage(
        {
          body: `❯ Thread ID: ${event.threadID}\n\n❯ Group Thread Image:`,
          attachment: fs.createReadStream(__dirname + '/cache/thread.png')
        },
        event.threadID,
        () => {
          fs.unlinkSync(__dirname + '/cache/thread.png');
        }
      );
    };

    request(imageSrc)
      .pipe(fs.createWriteStream(__dirname + '/cache/thread.png'))
      .on('close', callback);
  } else {
    api.sendMessage(
      `❯ Thread ID: ${event.threadID}\n\n❯ This thread does not have an image.`,
      event.threadID
    );
  }
 }
}