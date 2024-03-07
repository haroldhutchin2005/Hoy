module.exports = {
  name: "eval",
  hasPermission: "adminbot",
  Programmer: "Jonell Magallanes",
  info: "Evaluates arbitrary JavaScript code.",
  usages: "eval [code]",
  category: "system",
  cooldowns: 5,
  prefix: "enable",
  letStart: async ({ client, message, target, pushMessage, api, event }) => {
    if (!target.length) return box.send('Please provide code to evaluate.');
    try {
      const code = event.body.split(" ").slice(1).join(" ");
      let result = await eval(`(async () => { ${code} })()`);
      if (result === undefined) result = 'No output';
    } catch (e) {
      pushMessage.reply(`Error: ${e.message}`);
    }
  }
};