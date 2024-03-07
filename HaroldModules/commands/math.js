const math = require('mathjs');

module.exports = {
  name: "math",
  hasPermission: "members",
  Programmer: "Jonell Magallanes", // convert into Hutchins bot by Jonell Magallanes
  info: "Perform mathematical operations.",
  category: "utility",
  cooldowns: 5,
  prefix: "disable",

  letStart: async function ({ target, event, pushMessage, }) {
    try {
      const expression = target.join(" ");
      if (! expression) return pushMessage.reply("✒️ | Please Enter Your Calcution");
      const result = math.evaluate(expression);

      await pushMessage.reply(`📝 | 𝙈𝘼𝙏𝙃 𝙍𝙀𝙎𝙐𝙇𝙏\n\n${result}`);
    } catch (error) {
      console.error(error);
      await pushMessage.reply(`Mathematical operation failed!\nError: ${error.message}`, event.threadID);
    }
  }
};