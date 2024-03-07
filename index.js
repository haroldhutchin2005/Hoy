const fs = require('fs');
const path = require('path');
const express = require('express');
const { spawn } = require('child_process');
const app = express();

// Load configuration
const config = require('./config.json');

const commandsPath = './HaroldModules/commands';
const eventsPath = './HaroldModules/events';

const getFilesCount = (dirPath) => {
  try {
    return fs.readdirSync(dirPath).length;
  } catch (e) {
    return 0;
  }
};

let startPingTime = Date.now();
let botStartTime = Date.now();

async function getBotInformation() {
  return {
    owner: {
      name: harold.BotOwner,
      uid: harold.adminbot,
    },
    bot: {
      owner: harold.BotName,
      name: harold.name,
      uid: harold.adminbot,
      fmd: harold.FCA,
      repl: harold.REPL,
      lang: harold.language,
      ping: Date.now() - startPingTime,
    },
    fca: {
      module: config.FCA,
    },
  };
}

function sendLiveData(socket) {
  setInterval(() => {
    const uptime = Date.now() - botStartTime;

    socket.emit('real-time-data', { uptime });
  }, 1000);
}

app.get('/dashboard', async (req, res) => {
  const commandsCount = getFilesCount(commandsPath);
  const eventsCount = getFilesCount(eventsPath);
  const uptime = Date.now() - botStartTime;
  const botInformation = await getBotInformation();

  res.json({
    owner: botInformation.bot.owner,
    botPing: botInformation.bot.ping,
    botLang: botInformation.bot.lang,
    botRepl: botInformation.bot.repl,
    botFmd: botInformation.bot.fmd,
    botName: botInformation.bot.name,
    botUid: botInformation.bot.uid,
    ownerName: botInformation.owner.name,
    ownerUid: botInformation.owner.uid,
    prefix: harold.prefix,
    commandsCount: commandsCount,
    eventsCount: eventsCount,
    uptime: uptime,
  });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'harold.html')));

const http = require('http');
const { Server } = require('socket.io');
const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log('New client connected');
  sendLiveData(socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Monitor setup
const Monitor = require('ping-monitor');
var haroldUrl = `https://${process.env.REPL_ID}.sisko.replit.dev`;
const monitor = new Monitor({ website: haroldUrl, title: 'NAME', interval: 20 });
monitor.on('up', (res) => console.log(`[ ${haroldUrl} ] Has been Uptimed.`));

function startBot() {
  const child = spawn('node', ['--trace-warnings', '--async-stack-traces', 'main.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(`Bot exited with code ${code} and signal ${signal}`);
      process.exit(1); // Automatically exit and restart on any non-zero exit code
    }
  });
}

// Server setup
const port = process.env.PORT || 3030 || 3000 || 8080;
httpServer.listen(port, () => {
  console.log(`Listen on port ${port}`);
});

process.on('unhandledRejection', (err, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
}); 
