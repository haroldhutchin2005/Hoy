const fs = require('fs');
const { join } = require('path');
async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log(error);
    return "User";
  }
}
module.exports = {
  name: "help",
  Programer: "Jonell Magallanes",
  info: "Shows a list of available commands with pagination",
  usages: "[page number]",
  hasPermission: "anyone",
  prefix: "enable",
  letStart: async function ({ api, event, target }) {
    const commandsPath = join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    const commands = commandFiles.map(file => {
      const command = require(join(commandsPath, file));
      return { name: command.name, info: command.info, usages: command.usages, hasPermission: command.hasPermission, prefix: command.prefix };
    });

    const itemsPerPage = 4;
    let page = parseInt(target[0]) || 1;  
    const totalCommands = commands.length;
    const totalPages = Math.ceil(totalCommands / itemsPerPage);
    page = page < 1 ? 1 : page > totalPages ? totalPages : page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const randomQuotes = [
    "Octopuses have three hearts: two pump blood to the gills, and one pumps it to the rest of the body.",
      "Honey never spoils; archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
      "The world's oldest known recipe is for beer.",
      "Bananas are berries, but strawberries are not.",
      "Cows have best friends and can become stressed when they are separated.",
      "The shortest war in history was between Britain and Zanzibar on August 27, 1896; Zanzibar surrendered after 38 minutes.",
      "The average person walks the equivalent of three times around the world in a lifetime.",
      "Polar bears are left-handed.",
      "The unicorn is Scotland's national animal.",
      "A group of flamingos is called a 'flamboyance'.",
      "There are more possible iterations of a game of chess than there are atoms in the known universe.",
      "The smell of freshly-cut grass is actually a plant distress call.",
      "A day on Venus is longer than its year.",
      "Honeybees can recognize human faces.",
      "Wombat poop is cube-shaped.",
      "The first oranges weren't orange.",
      "The longest time between two twins being born is 87 days.",
      "A bolt of lightning is six times hotter than the sun.",
      "A baby puffin is called a puffling.",
      "A jiffy is an actual unit of time: 1/100th of a second.",
      "The word 'nerd' was first coined by Dr. Seuss in 'If I Ran the Zoo'.",
      "There's a species of jellyfish that is biologically immortal.",
      "The Eiffel Tower can be 6 inches taller during the summer due to the expansion of the iron.",
      "The Earth is not a perfect sphere; it's slightly flattened at the poles and bulging at the equator.",
      "A hummingbird weighs less than a penny.",
      "Koalas have fingerprints that are nearly identical to humans'.",
      "There's a town in Norway where the sun doesn't rise for several weeks in the winter, and it doesn't set for several weeks in the summer.",
      "A group of owls is called a parliament.",
      "The fingerprints of a koala are so indistinguishable from humans' that they have on occasion been confused at a crime scene.",
      "The Hawaiian alphabet has only 13 letters.",
      "The average person spends six months of their life waiting for red lights to turn green.",
      "A newborn kangaroo is about 1 inch long.",
      "The oldest known living tree is over 5,000 years old.",
      "Coca-Cola would be green if coloring wasn't added to it.",
      "A day on Mars is about 24.6 hours long.",
      "The Great Wall of China is not visible from space without aid.",
      "A group of crows is called a murder.",
      "There's a place in France where you can witness an optical illusion that makes you appear to grow and shrink as you walk down a hill.",
      "The world's largest desert is Antarctica, not the Sahara.",
      "A blue whale's heart is so big that a human could swim through its arteries.",
      "The longest word in the English language without a vowel is 'rhythms'.",
      "Polar bears' fur is not white; it's actually transparent.",
      "The electric chair was invented by a dentist.",
      "An ostrich's eye is bigger than its brain.",
      "Wombat poop is cube-shaped."
    ];

    const randomQuote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];

    let helpText = `${await getUserName(api, event.senderID)} Here the commands to help you ${global.harold.name} 😄:\n\n`;

    const commandsToShow = commands.slice(start, end);

    commandsToShow.forEach(command => {
      helpText += `\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n╭─❍\n➠ 𝗡𝗮𝗺𝗲: ${command.name}\n╰───────────⟡\n╭─❍\n➠ 𝗜𝗻𝗳𝗼: ${command.info}\n╰───────────⟡\n╭─❍\n➠ 𝗨𝘀𝗮𝗴𝗲𝘀: ${command.usages}\n╰───────────⟡\n╭─❍\n➠ 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: ${command.hasPermission}\n╰───────────⟡\n╭─❍\n➠ 𝗡𝗲𝗲𝗱𝗲𝗱 𝗣𝗿𝗲𝗳𝗶𝘅: ${command.prefix}\n╰───────────⟡\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
    });

    if (page < totalPages) {
      helpText += `Random Facts\n${randomQuote}\n\nType '${global.harold.prefix}help ${page + 1}' to see the next`;
    }

    api.sendMessage(helpText, event.threadID, event.messageID);
  }
};