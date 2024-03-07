const google = require('googlethis');

module.exports = {
  name: "definition",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "Search the definition of a word.",
  category: "language",
  cooldowns: 5,
  prefix: "disable",
  letStart: async function ({ target, event, pushMessage }) {
    const wordsAfterOf = target.join(" ");
    if (!wordsAfterOf) return pushMessage.reply("Please Provide a Word to Search");
pushMessage.reply(`⏱️ | Search For word "${wordsAfterOf}"`);
    const response = await google.search('Meaning of ' + wordsAfterOf);
    let definitions = "";
    let counter = 0;
    for (let definition of response.dictionary.definitions) {
      counter += 1;
      definitions += counter + ". " + definition + "\n";
    }
    pushMessage.reply(`Meaning of ${wordsAfterOf}:\n\n${definitions}`);
  }
}; 