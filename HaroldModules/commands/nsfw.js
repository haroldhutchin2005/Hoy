const fs = require('fs');
const path = require('path');

const nsfwDataFile = path.join(__dirname, 'nsfw.json');

function loadNSFWData() {
  try {
    return JSON.parse(fs.readFileSync(nsfwDataFile, { encoding: 'utf8' })) || {};
  } catch (error) {
    // If the file doesn't exist, create an empty one
    saveNSFWData({});
    return {};
  }
}

function saveNSFWData(data) {
  fs.writeFileSync(nsfwDataFile, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "nsfw",
  hasPermission: "members",
  Programmer: "Jonell Magallanes", // JONELL CC
  prefix: "enable",
  info: "Toggle NSFW status",
  category: "nsfw",
  cooldowns: 1,

  letStart: async function ({ api, event }) {
    const nsfwData = loadNSFWData();
    const threadID = event.threadID;

    // Toggle NSFW status for the current threadID
    if (nsfwData[threadID] && nsfwData[threadID].isNSFW) {
      nsfwData[threadID] = { isNSFW: false };
      api.sendMessage("✅ | NSFW is now turned off for this thread.", threadID);
    } else {
      nsfwData[threadID] = { isNSFW: true };
      api.sendMessage("✅ | NSFW is now turned on for this thread.", threadID);
    }

    // Save the updated NSFW data
    saveNSFWData(nsfwData);
  }
};
