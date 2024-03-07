module.exports = {
    name: "maintenance",
    version: "1.0.0",
    hasPermission: "adminbot",
    programmer: "Jonell Magallanes",
    info: "Announce Bot maintenance due errors",
    prefix: "enable",
    category: "System",
    cooldowns: 5,

    letStart: function({ api, event, target }) {
        var fs = require("fs");
        var request = require("request");

        api.getThreadList(30, null, ["INBOX"], (err, list) => {
            if (err) { 
                console.error("ERR: " + err);
                return;
            }
            const content = target.join(" ");
            if (!content) return api.sendMessage("Please Enter Your Maintenance Message", event.threadID);
            list.forEach(thread => {
                if(thread.isGroup == true && thread.threadID != event.threadID) {
                    var link = "https://i.postimg.cc/NFdDc0vV/RFq-BU56n-ES.gif";  
                    var callback = () => api.sendMessage({ 
                        body: `${global.harold.name} BOT is currently under maintenance. Please be patient.\n\nReason: ${content}\n\nDeveloper: Jonell Magallanes`, 
                        attachment: fs.createReadStream(__dirname + "/cache/maintenance.gif")
                    }, 
                    thread.threadID, 
                    () => { 
                        fs.unlinkSync(__dirname + "/cache/maintenance.gif");
                        console.log(`Maintenance message sent to ${thread.threadID}. Now shutting down.`);
                        process.exit(); 
                    });

                    return request(encodeURI(link))
                        .pipe(fs.createWriteStream(__dirname + "/cache/maintenance.gif"))
                        .on("close", callback);
                }
            });
        });

        console.log("The bot is now off for maintenance.");
    }
};