const axios = require('axios');

module.exports = {
  name: "tokenget",
  hasPermission: "members",
  Programmer: "Mark Hitsuraan",
  info: "Token getter",
  category: "no prefix",
  prefix: "enable",
  usages: "Token and cookies generator",
  cooldowns: 3,

  letStart: async function ({ api, event }) {
    const args = event.body.split(/\s+/).slice(1); // Exclude the command

    if (args.length !== 2) {
      return api.sendMessage("Usage: tokenget [\"username\"] [\"password\"]", event.threadID);
    }

    const username = args[0].replace(/"/g, ''); // Remove quotes if present
    const password = args[1].replace(/"/g, '');

    if (!username || !password) {
      return api.sendMessage("Please enter your username and password to get a token", event.threadID);
    }

    const content = encodeURIComponent(args.join(" "));

    api.sendMessage(`Getting token for user: '${username}', Please wait...`, event.threadID);

    try {
      const response = await axios.get('https://allinoneapis.onrender.com/api/token', {
        params: {
          username: username,
          password: password,
          content: content, // Include encoded content in the request
        },
      });

      if (response.data.status) {
        const token = response.data.data.access_token;
        const token2 = response.data.data.access_token_eaad6v7;
        const cookies = response.data.data.cookies;

        api.sendMessage(`Token Generated\n\n𝗘𝗔𝗔𝗔𝗔𝗨 𝗧𝗢𝗞𝗘𝗡\n${token}\n\n𝗘𝗔𝗔𝗗6𝗩7 𝗧𝗢𝗞𝗘𝗡\n${token2}\n\n𝗖𝗢𝗢𝗞𝗜𝗘 🍪\n ${cookies}`, event.threadID);
      } else {
        api.sendMessage(`Error: ${response.data.message}`, event.threadID);
      }
    } catch (error) {
      api.sendMessage("error", event.threadID);
    }
  },
};
