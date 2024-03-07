const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "checkweb",
  Programmer: "Jonell Magallanes", 
  hasPermission: "members",
  info: "Check a web link for errors",
  prefix: "disable",
  category: "Education",
  usages: "checkweb [web link]",
  cooldowns: 10,

  letStart: async function ({ api, event, target }) {
    const webLink = target.join(" ");

    // Create the ./cache directory if it doesn't exist
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    try {
      const response = await axios.get(webLink, { responseType: 'arraybuffer' });

      if (response.status === 200) {
        // For 200 status, generate a success message and use the saved image as an attachment
        const successMessage = `Web link is OK for ${webLink}: ${response.statusText}`;
        const filePath = path.join(cacheDir, 'success_image.jpg');
        fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));
        api.sendMessage({ body: successMessage, attachment: fs.createReadStream(filePath) }, event.threadID);
      } else if (response.status === 400) {
        // For 400 status, generate a bad request message and use a predefined image link as an attachment
        const badRequestMessage = `Bad Request for ${webLink}: ${response.status}`;
        api.sendMessage({ body: badRequestMessage, attachment: 'https://i.postimg.cc/jdqcNBQr/New-Project-1212-Copy-Copy-8-FF9-E7-C.png' }, event.threadID);
      } else if (response.status === 500) {
        // For 500 status, generate an internal server error message and use a predefined image link as an attachment
        const errorCodeMessage = `Internal Server Error for ${webLink}: ${response.status}`;
        api.sendMessage({ body: errorCodeMessage, attachment: 'https://i.postimg.cc/zGXQzVPK/New-Project-1212-Copy-Copy-88-BB420.png' }, event.threadID);
      } else {
        // For other status codes, generate an unexpected message
        const unexpectedMessage = `Unexpected status code: ${response.status}`;
        api.sendMessage({ body: unexpectedMessage }, event.threadID);
      }
    } catch (error) {
      // Handle errors such as network issues or invalid URLs, and use a predefined image link as an attachment
      const errorMessage = `Error checking the web link: ${webLink}. ${error.message}`;
      api.sendMessage({ body: errorMessage, attachment: 'https://i.postimg.cc/jdCNRT4C/New-Project-1212-Copy-Copy-4-DBEC6-A.png' }, event.threadID);
    }
  }
};
