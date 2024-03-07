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
  // Calculate the required experience points dynamically based on the level
  const requiredXp = Math.floor(1000 * Math.pow(level, 2));

  // Dynamic API endpoint with user-specific parameters
  const rankApiUrl = `https://rank2api-5faa0e644e2f.herokuapp.com/rankCard?name=${encodeURIComponent(name)}&level=Level${level}&color=auto&facebookSenderId=${senderID}&progress=69&rank=1&currentXp=${currentExp}&requiredXp=${requiredXp}&showXp=true`;

  try {
    const response = await axios.get(rankApiUrl, { responseType: 'arraybuffer' });

    // Save the rank card image locally
    const imagePath = path.join(__dirname, 'cache', `rankcard_${senderID}.jpeg`);
    await fsPromises.writeFile(imagePath, response.data, 'binary');

    return imagePath;
  } catch (error) {
    console.error('Error updating Rank API:', error.message);
    return null;
  }
}

module.exports = {
  name: "rankup",
  hasPermission: "members",
  prefix: "disable",
  Programmer: "Jonell Magallanes",
  info: "no prefix",
  category: "No command marks needed",
  usages: "?",
  cooldowns: 5,

  noPrefix: async function ({ api, event }) {
    let userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    let currencies = JSON.parse(fs.readFileSync(currenciesPath, 'utf8'));
    const userId = event.senderID;

    if (userData[userId]) {
      userData[userId].exp = (userData[userId].exp || 0) + 1;
      const expNeeded = Math.floor(5 * Math.pow(userData[userId].level || 1, 2));
      if (userData[userId].exp >= expNeeded) {
        userData[userId].level += 1;
        userData[userId].exp -= expNeeded;
        currencies[userId] = currencies[userId] || { balance: 0, lastDaily: new Date().toISOString() };
        currencies[userId].balance += 5;
        const rankLevel = userData[userId].level;
        const announcement = `${await getUserName(api, userId)} has leveled up to level ${rankLevel}!`;

        // Update Rank API and get the image path
        const imagePath = await updateRankApi(userId, await getUserName(api, userId), userData[userId].exp, rankLevel);

        // Send both text and image as an attachment
        if (imagePath) {
          api.sendMessage({
            body: announcement,
            attachment: fs.createReadStream(imagePath)
          }, event.threadID);
        } else {
          // If image update fails, send only the text
          api.sendMessage(announcement, event.threadID);
        }
      }
    } else {
      userData[userId] = { exp: 1, level: 1 };
      currencies[userId] = { balance: 5, lastDaily: new Date().toISOString() };
    }

    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    fs.writeFileSync(currenciesPath, JSON.stringify(currencies, null, 2));
  },

  letStart: ({}) => {}
};
