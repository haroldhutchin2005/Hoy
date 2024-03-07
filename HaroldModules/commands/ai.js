const axios = require('axios');
const fs = require('fs').promises;

const storageFile = 'user_data.json';
const chatRecordFile = 'chat_records.json';

module.exports = {
  name: "ai",
  Programmer: "Jonell Magallanes", 
  hasPermission: "members",
  info: "AI GPT",
  prefix: "disable",
  category: "Education",
  usages: "ai [your question] or ?ai recent",
  cooldowns: 10,

  letStart: async function ({ api, event, target }) {
    const content = encodeURIComponent(target.join(" "));
    const uid = event.senderID;
    const apiUrl = `https://jonellccapis-dbe67c18fbcf.herokuapp.com/api/globalgpt?content=${content}`; // Updated API URL

    if (!content) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", event.threadID, event.messageID);

    try {
      api.sendMessage("🔍 | AI is searching for your answer. Please wait...", event.threadID, event.messageID);

      // Get user's conversation history
      const conversationHistory = await getConversationHistory(uid);

      // Add the current question to the conversation history
      conversationHistory.push({ timestamp: Date.now(), question: content });
      await saveConversationHistory(uid, conversationHistory);

      // Combine previous messages for context
      const context = conversationHistory.map(entry => entry.question).join('\n');

      // Include context in the API request
      const response = await axios.get(`${apiUrl}&context=${encodeURIComponent(context)}`);
      const { content: result, requestCount } = response.data; // Updated response structure

      // Update user data
      const userData = await getUserData(uid);
      userData.requestCount = (userData.requestCount || 0) + 1;
      userData.responses = userData.responses || [];
      userData.responses.push({ question: content, response: result });
      await saveUserData(uid, userData);

      // Record chat
      recordChat(uid, content);

      // Get total request count and list of users who asked questions
      const totalRequestCount = await getTotalRequestCount();
      const userNames = await getUserNames(api, uid);

      // Generate response
      const responseMessage = `${result}\n\n📝 Request Count: ${requestCount}\n👤 Asked Questions by: ${userNames.join(', ')}`;
      api.sendMessage(responseMessage, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
  },

  // Command to inquire about recent questions
  recentQuestions: async function ({ api, event }) {
    const uid = event.senderID;
    try {
      const recentQuestions = await getRecentQuestions(uid);
      if (recentQuestions.length === 0) {
        api.sendMessage("You haven't asked any questions recently.", event.threadID, event.messageID);
        return;
      }

      const formattedQuestions = recentQuestions.map(entry => `• ${entry.question}`).join('\n');

      api.sendMessage(`Your recent questions:\n${formattedQuestions}`, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while retrieving your recent questions.", event.threadID);
    }
  },
};

// Additional function to get recent questions
async function getRecentQuestions(uid) {
  try {
    const conversationHistory = await getConversationHistory(uid);
    const recentQuestions = conversationHistory.slice(-5); // Get the last 5 questions
    return recentQuestions;
  } catch (error) {
    console.error('Error getting recent questions:', error);
    return [];
  }
}

// Remaining functions (getUserData, saveUserData, getTotalRequestCount, getUserNames, getAllUserData, recordChat, getChatRecords) remain unchanged

async function getUserData(uid) {
  try {
    const data = await fs.readFile(storageFile, 'utf-8');
    const jsonData = JSON.parse(data);
    return jsonData[uid] || {};
  } catch (error) {
    return {};
  }
}

async function saveUserData(uid, data) {
  try {
    const existingData = await getUserData(uid);
    const newData = { ...existingData, ...data };
    const allData = await getAllUserData();
    allData[uid] = newData;
    await fs.writeFile(storageFile, JSON.stringify(allData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

async function getTotalRequestCount() {
  try {
    const allData = await getAllUserData();
    return Object.values(allData).reduce((total, userData) => total + (userData.requestCount || 0), 0);
  } catch (error) {
    return 0;
  }
}

async function getUserNames(api, uid) {
  try {
    const userInfo = await api.getUserInfo([uid]);
    return Object.values(userInfo).map(user => user.name || `User${uid}`);
  } catch (error) {
    console.error('Error getting user names:', error);
    return [];
  }
}

async function getAllUserData() {
  try {
    const data = await fs.readFile(storageFile, 'utf-8');
    return JSON.parse(data) || {};
  } catch (error) {
    return {};
  }
}

function recordChat(uid, question) {
  try {
    const chatRecords = getChatRecords();
    const userChat = chatRecords[uid] || [];
    userChat.push({ timestamp: Date.now(), question });
    chatRecords[uid] = userChat;
    fs.writeFile(chatRecordFile, JSON.stringify(chatRecords, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error recording chat:', error);
  }
}

function getChatRecords() {
  try {
    const data = fs.readFileSync(chatRecordFile, 'utf-8');
    return JSON.parse(data) || {};
  } catch (error) {
    return {};
  }
}

async function getConversationHistory(uid) {
  try {
    const data = await fs.readFile(`conversation_history_${uid}.json`, 'utf-8');
    return JSON.parse(data) || [];
  } catch (error) {
    return [];
  }
}

async function saveConversationHistory(uid, history) {
  try {
    await fs.writeFile(`conversation_history_${uid}.json`, JSON.stringify(history, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving conversation history:', error);
  }
}
