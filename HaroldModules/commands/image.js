module.exports = {
    name: "image",
    hasPermission: "members",
    Programmer: "Prince Sanel moded by jonell",
    info: "Image search",
    prefix: "enable",
    category: "Search",
    usages: "[Text] - [amount of search]",
    cooldowns: 0,

letStart: async function({ api, event, target, pushMessage }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");
    const keySearch = target.join(" ");
    if(keySearch.includes("-") == false) return pushMessage.reply(`Please enter in the format, example: ${global.harold.prefix}Captain Underpants - 10`); pushMessage.reply(`⏱️ | Currently Searching for "${keySearch}" Please Wait....`);
    const keySearchs = keySearch.substr(0, keySearch.indexOf('-'))
    const numberSearch = keySearch.split("-").pop() || 6
    const res = await axios.get(`https://api-dien.kira1011.repl.co/pinterest?search=${encodeURIComponent(keySearchs)}`);
    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
      let path = __dirname + `/cache/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
      imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
    }
    pushMessage.reply({
        attachment: imgData,
        body: numberSearch + 'Search results for keyword: '+ keySearchs
    }, event.threadID, event.messageID)
    for (let ii = 1; ii < parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/cache/${ii}.jpg`)
    }
}
};