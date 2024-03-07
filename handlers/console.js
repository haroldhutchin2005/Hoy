const chalk = require('chalk');
const gradient = require('gradient-string');
const moment = require('moment');
const EventEmitter = require('events').EventEmitter;
const liveChatEmitter = new EventEmitter();

// Function to handle the received chat messages
const handleChatMessage = (api, threadID, senderID, body) => {
  liveChatEmitter.emit('newMessage', { api, threadID, senderID, body });
};

// Event listener for new chat messages
liveChatEmitter.on('newMessage', async ({ api, threadID, senderID, body }) => {
  const thread = await Threads.getInfo(threadID);
  const threadName = thread.threadName || "Unknown Group";

  // Skip logging if it's a message from the bot itself
  if (senderID === api.getCurrentUserID()) return;

  // Skip logging if the console is turned off for the thread
  if (thread.console === false) return;

  const time = moment().format('YYYY-MM-DD HH:mm:ss');
  const gradientText = (text) => gradient('cyan', 'pink')(text);
  const boldText = (text) => chalk.bold(text);

  console.log(gradientText("━━━━━━━━━━[ DATABASE THREADS BOT LOGS ]━━━━━━━━━━"));
  console.log(gradientText("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"));
  console.log(`${boldText(gradientText(`┣➤ Group: ${threadName}`))}`);
  console.log(`${boldText(gradientText(`┣➤ Group ID: ${threadID}`))}`);
  console.log(`${boldText(gradientText(`┣➤ User ID: ${senderID}`))}`);
  console.log(`${boldText(gradientText(`┣➤ Content: ${body || "N/A"}`))}`);
  console.log(`${boldText(gradientText(`┣➤ Time: ${time}`))}`);
  log(gradientText("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"));
});

// Example of how you might call handleChatMessage when a new chat message is received
// handleChatMessage(api, '123456789', '987654321', 'Hello World!');