const google = require('googlethis');

module.exports = {
  name: "search",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "Search for information on Google.",
  category: "utility",
  cooldowns: 5,
  prefix: "disable",
  letStart: async function ({ target, event, pushMessage }) {
    const query = target.join(" ");
    if (!query) return pushMessage.reply("Please provide a query to search.");
    pushMessage.reply(`⏱️ | Searching for "${query}"`);
    const response = await google.search(query);
    let searchResults = "";
    let counter = 0;
    for (let result of response.results) {
      counter += 1;
      searchResults += counter + ". " + result.title + " - " + result.link + "\n";
    }
    pushMessage.reply(`Search results for ${query}:\n\n${result}`);
  }
};