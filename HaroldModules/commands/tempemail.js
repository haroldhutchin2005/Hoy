module.exports = {
  name: "tempemail",
  hasPermission: "members",
  Programmer: "Mirai Team",
  info: "Generate a random temporary email address.",
  prefix: "enable",
  category: "utility",
  cooldowns: 5,
  letStart: async function({ api, event, target }) {
    const axios = require('axios');

    if (target[0] === 'inbox' && target[1]) {
      const login = target[1].split('@')[0];
      const domain = target[1].split('@')[1];
      const inboxUrl = `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`;
      try {
        const response = await axios.get(inboxUrl);
        const messages = response.data.map(message => {
          return `From: ${message.from}\nSubject: ${message.subject}\nDate: ${message.date}\nBody: ${message.textBody}`;
        }).join('\n\n');
        api.sendMessage(`Inbox for ${login}@${domain}:\n${messages}`, event.threadID);
      } catch (error) {
        api.sendMessage('Error fetching inbox.', event.threadID);
      }
    } else {
      const emailUrl = 'https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1';
      try {
        const response = await axios.get(emailUrl);
        const email = response.data[0];
        api.sendMessage(`Your temporary email is: ${email}`, event.threadID);
      } catch (error) {
        api.sendMessage('Error generating temporary email.', event.threadID);
      }
    }
  }
};