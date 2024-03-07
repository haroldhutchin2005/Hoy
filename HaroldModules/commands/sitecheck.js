const linkCheck = require('link-check');

module.exports = {
  name: "sitecheck",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "Check the status of a provided URL",
  category: "utility",
  cooldowns: 5,
  prefix: "enable",

  letStart: async function ({ api, event, target }) {
    const urlToCheck = target.join(' ');
    if (!urlToCheck) {
      api.sendMessage('Please provide a URL to check.', event.threadID);
      return;
    }

    linkCheck(urlToCheck, function (err, result) {
      if (err) {
        console.error(err);
        api.sendMessage('Error checking the link.', event.threadID);
        return;
      }
      api.sendMessage(`𝗦𝗜𝗧𝗘 𝗖𝗛𝗘𝗖𝗞𝗘𝗥 🔎\n\n🖇️ 𝗟𝗜𝗡𝗞: ${result.link}\n\n🌐 𝗦𝗧𝗔𝗧𝗨𝗦: ${result.status}`, event.threadID);
    });
  }
};