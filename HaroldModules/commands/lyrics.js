const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "lyrics",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "Find song lyrics.",
  category: "music",
  cooldowns: 5,
  prefix: "enable",

  letStart: async function ({ target, event, pushMessage }) {
    try {
      const songName = target.join(" ");
      if (!songName) return pushMessage.reply("Please Provide Your Song Name");
      pushMessage.reply(`📝 | Searching The Lyrics Of "${songName}"`);
      const res = await axios.get('https://lyrist.vercel.app/api/' + songName);
      const { lyrics, title, artist, image } = res.data;

      const imageResponse = await axios.get(image, { responseType: 'arraybuffer' });
      const imageFilePath = path.join(__dirname, 'cache', `${title.toLowerCase().split(' ').join('-')}.png`);
      fs.writeFileSync(imageFilePath, Buffer.from(imageResponse.data, 'binary'));

      await pushMessage.reply({
        body: `🎵 ${title} by ${artist} 🎵\n\n${lyrics}\n\nSinger:${artist }`,
        attachment: fs.createReadStream(imageFilePath),
      });
    } catch (error) {
      console.error(error);
      await pushMessage.reply(`Failed to fetch lyrics: ${error.message}`);
    }
  }
};