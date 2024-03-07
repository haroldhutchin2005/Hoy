const axios = require('axios');
const fs = require('fs');
const request = require('request');
const xml2js = require('xml2js');
const path = require('path');

module.exports = {
    name: "r34search",
    hasPermission: "members",
    Programer: "Jonell Magallanes and Nethanel Debulgado",
    info: "Search and save rule34 image with title",
  prefix: "disable",
    category: "nsfw",
    cooldowns: 10,

letStart: async ({ api, event, target }) => {
    const userDataFile = path.join(__dirname, 'cache', 'currencies.json');
    let userData = JSON.parse(fs.readFileSync(userDataFile, { encoding: 'utf8' }));
    const userId = event.senderID;

    if (!userData[userId] || userData[userId].balance < 10) {
        api.sendMessage("You need at least $10 currencies to use this command.", event.threadID);
        return;
    }

    api.sendMessage("📪 | Sending Please Wait...", event.threadID, event.messageID);
    const searchTitle = target.join(" ");
    const parser = new xml2js.Parser();

    try {
        const response = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURI(searchTitle)}`);
        parser.parseStringPromise(response.data).then((result) => {
            const posts = result.posts.post;
            posts.forEach((post, index) => {
                const imgUrl = post.$.file_url;
                const imgPath = __dirname + `/cache/rule34_${index}.jpg`;
                request(imgUrl).pipe(fs.createWriteStream(imgPath)).on("close", () => {
                    userData[userId].balance -= 10; // Deduct 10 currencies
                    fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));
                    api.sendMessage({
                        body: `Image ${index + 1}: ${searchTitle}`,
                        attachment: fs.createReadStream(imgPath)
                    }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);
                });
            });
        });
    } catch (err) {
        api.sendMessage("API error, please try again later", event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, (err) => {}, true);
    }
}
}
