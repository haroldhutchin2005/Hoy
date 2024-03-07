const ytdl = require('ytdl-core');
const simpleytapi = require('simple-youtube-api');
const path = require('path');
const fs = require('fs');

module.exports = {
  name: "youtube",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  prefix: "enable",
  info: "Search and send YouTube video",
  category: "video",
  cooldowns: 3,

  letStart: async function ({ pushMessage, target, event, api }) {
    const youtube = new simpleytapi('AIzaSyCMWAbuVEw0H26r94BhyFU4mTaP5oUGWRw');

    const searchString = target.join(' ');
if (!searchString) return pushMessage.reply("📝 | Please Enter Your Search Query to Youtube Command");
    try {
      const videos = await youtube.searchVideos(searchString, 1);
      pushMessage.reply(`⏱️ | Search for ${searchString} Please Wait....`);
      console.log(`downloading Video of ${videos[0].title}`);
      const url = `https://www.youtube.com/watch?v=${videos[0].id}`;

      const videoInfo = await ytdl.getInfo(url);
      const videoTitle = videoInfo.videoDetails.title;
      const videoDescription = videoInfo.videoDetails.description;
      const file = path.resolve(__dirname, 'cache', `video.mp4`);
      console.log(`Downloaded Complete Ready to send The user`);

      ytdl(url, { filter: 'videoandaudio' }).pipe(fs.createWriteStream(file)).on('finish', () => {
        pushMessage.reply({
          body: `🎥 | Here's the YouTube video you requested\nURL: ${url}\n\nTitle: ${videoTitle}\nDescription: ${videoDescription}`,
          attachment: fs.createReadStream(file)
        }, event.threadID);
      });
    } catch (error) {
      pushMessage.reply("🚨 | An error occurred while searching for the YouTube video.", event.threadID);
    }
  }
};