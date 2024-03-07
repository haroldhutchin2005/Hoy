const axios = require('axios');

module.exports = {
  name: 'hutchins',
  hasPermission: 'members',
  credits: 'Jonell Magallanes',
  info: '',
  usages: 'hutchins [your question]',
  category: 'ai',
  cooldowns: 10,
  prefix: 'enable',

  letStart: async function({ api, event, target }) {
    const question = target.join(' ');

    const apiUrl = `https://hutchins-ai.hutchins10.repl.co/chat?prompt=${question}`;

    try {
      const response = await axios.get(apiUrl);

      const aiResponse = response.data.message.content;

      await api.sendMessage(aiResponse, event.threadID);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  },
};
