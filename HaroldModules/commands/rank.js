const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promises: fsPromises } = require('fs');

const userDataPath = path.join(__dirname, 'cache', 'userData.json');
const currenciesPath = path.join(__dirname, 'cache', 'currencies.json');

async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log(error);
    return "User";
  }
}

async function updateRankApi(senderID, name, currentExp, level) {
  const rankApiUrl = `https://rankapi-67c69fb56cc3.herokuapp.com/rank?id=${senderID}&name=${encodeURIComponent(name)}&backgroundimage=https://i.imgur.com/GbkHOGA.jpeg&needxp=1000&currenexp=${currentExp}&level=${level}`;

  try {
    const response = await axios.get(rankApiUrl, { responseType: 'arraybuffer' });

    const imagePath = path.join(__dirname, 'cache', 'rankcard.jpeg');
    await fsPromises.writeFile(imagePath, response.data, 'binary');

    return imagePath;
  } catch (error) {
    console.error('Error updating Rank API:', error.message);
    return null;
  }
}

module.exports = {
  name: "rank",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "View your rank based on experience.",
  category: "utility",
  cooldowns: 5,
  prefix: "enable",

  letStart: async function ({ api, event }) {
    let userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    const userId = event.senderID;

    if (!userData[userId]) {
      return api.sendMessage("You have not started ranking yet.", event.threadID);
    }

    const checkingMessage = await api.sendMessage("Checking your Database...", event.threadID);


    const rankLevel = userData[userId].level;
    const rankEXP = userData[userId].exp;

    const imagePath = await updateRankApi(userId, await getUserName(api, userId), rankEXP, rankLevel);

    api.sendMessage({
      body: `𝗥𝗔𝗡𝗞 𝗟𝗘𝗩𝗘𝗟 📑\n━━━━━━━━━━━━━━━━━━\n\n${await getUserName(api, event.senderID)} HUTCHINS RANK VIEW\n\n𝗥𝗔𝗡𝗞:『 ${rankLevel} 』\n\n𝗘𝗫𝗣:『 ${rankEXP} 』`,
      attachment: fs.createReadStream(imagePath),
    }, event.threadID);

    await api.unsendMessage(checkingMessage.messageID);
  }
};
