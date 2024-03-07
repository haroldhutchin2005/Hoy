const axios = require('axios');

module.exports = {
  name: 'bible',
  Programmer: 'Jonell Magallanes',
  info: 'Fetches a Bible verse based on the given reference',
  hasPermission: 'members',
  category: 'religion',
  usages: 'bible [verse]',
  cooldowns: 5,
  prefix: 'enable',

letStart: async function ({ pushMessage, target }) {
    const reference = target.join(' ');
  if (!reference) return pushMessage.reply("Please provide the Bible Name");
    const apiUrl = `https://bible-api.com/${encodeURIComponent(reference)}`;

    try {
      const response = await axios.get(apiUrl);
      const verseData = response.data;
      
      const formattedResponse = `**${verseData.reference} (${verseData.translation_name})**\n${verseData.text}`;

      pushMessage.reply(formattedResponse);
    } catch (error) {
      console.error(error);
      pushMessage.reply('An error occurred while fetching the Bible verse. Please try again later.');
    }
  },
};
