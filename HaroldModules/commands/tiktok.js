const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "tiktok",
  hasPermission: "members",
  Programer: "Jonell Magallanes",
  info: "tiktok search",
  category: "tiktok",
  prefix: "enable",
  usage: "[Tiktok <search>]",
  cooldowns: 5,

letStart: async function({ api, event, target }) {
  try {
    const searchQuery = target.join(" ");
    if (!searchQuery) {
      api.sendMessage("Usage: tiktok <search text>", event.threadID);
      return;
    }

    api.sendMessage("Searching, please wait...", event.threadID);

    const response = await axios.get(`https://tiktok-searc-api-video.onrender.com/tiktok/searchvideo?keywords=${encodeURIComponent(searchQuery)}`);
    const videos = response.data.data.videos;

    if (!videos || videos.length === 0) {
      api.sendMessage("No videos found for the given search query.", event.threadID);
      return;
    }

    const videoData = videos[0];
    const videoUrl = videoData.play;

    const message = `𝐓𝐢𝐤𝐭𝐨𝐤 𝐫𝐞𝐬𝐮𝐥𝐭:\n\n𝐏𝐨𝐬𝐭 𝐛𝐲: ${videoData.author.nickname}\n𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${videoData.author.unique_id}\n\n𝐓𝐢𝐭𝐥𝐞: ${videoData.title}`;

    const filePath = path.join(__dirname, `/cache/tiktok_video.mp4`);
    const writer = fs.createWriteStream(filePath);

    const videoResponse = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream'
    });

    videoResponse.data.pipe(writer);

    writer.on('finish', () => {
      api.sendMessage(
        { body: message, attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );
    });
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("An error occurred while processing the request.", event.threadID);
  }
}
                          }
