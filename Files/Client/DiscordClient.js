const Discord = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const database = require('./database.js')
const errorLog = require('../Modules/errorlog.js');
mursyCoin = "<:MursyCoin:970535071528394807>";
randomColor = Math.floor(Math.random() * (0xffffff + 1))

// 'GUILD_VOICE_STATES', 'GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'
const client = new Discord.Client(
  {
    shards: 'auto',
    intents: [
      Discord.IntentsBitField.Flags.Guilds,
      Discord.IntentsBitField.Flags.GuildMessages,
      Discord.IntentsBitField.Flags.GuildMembers,
      Discord.IntentsBitField.Flags.DirectMessageReactions,
      Discord.IntentsBitField.Flags.DirectMessages,
      Discord.IntentsBitField.Flags.MessageContent,
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMembers,
      Discord.GatewayIntentBits.GuildVoiceStates
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION", "CHANNEL", "USER", "MEMBER"],
    // rest: { api: "http://38.64.239.106:5982/api" }
  }
);
const { AutoPoster } = require('topgg-autoposter')

client.db = database;


/**
    * Reads the contents of the directory containing the command files and returns an array of file names.
    * @function
    * @param {string} folder - The name of the folder containing the command files.
    * @returns {string[]} An array of file names in the specified folder.
    */
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync("./Files/Commands");
for (const folder of commandFolders) {
  if (folder.endsWith(".js")) {
    const command = require(`../Commands/${folder}`);
    client.commands.set(command.name, command);
  } else {
    const commandFiles = fs.readdirSync(`./Files/Commands/${folder}`);
    for (const file of commandFiles) {
      const command = require(`../Commands/${folder}/${file}`);
      command.category = folder;
      client.commands.set(command.name, command);
    }
  }
}

client.slashCommands = new Discord.Collection();
const commandFolder = fs.readdirSync("./Files/SlashCommands");
for (const folder of commandFolder) {
  if (folder.endsWith(".js")) {
    const command = require(`../SlashCommands/${folder}`);
    client.slashCommands.set(command.name, command);
  } else {
    const commandFile = fs.readdirSync(`./Files/SlashCommands/${folder}`);
    for (const file of commandFile) {
      const command = require(`../SlashCommands/${folder}/${file}`);
      command.category = folder;
      client.slashCommands.set(command.name, command);
    }
  }
}

function watchFolder(folderToWatch) {
  try {
    fs.watch(folderToWatch, (eventType, filename) => {
      if (eventType === 'rename' && filename.endsWith('.js')) {
        console.log(`A New File has been added: ${folderToWatch}/${filename}`)
        const filePath = path.join(process.cwd(), folderToWatch, filename);
        delete require.cache[require.resolve(filePath)];
        const newCommand = require(filePath);

        client.commands.set(newCommand.name, newCommand);
      }
    });

    const subdirectories = fs.readdirSync(folderToWatch, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(folderToWatch, dirent.name));

    for (const subdirectory of subdirectories) {
      watchFolder(subdirectory);
    }
  } catch (e) {
    console.log(`A File has been deleted: ${folderToWatch}/${filename}`)
  }
}
watchFolder('./Files/Commands');


client.events = new Discord.Collection();
const eventsDir = fs.readdirSync("./Files/Events");
const reg = new RegExp(".js", "g");
for (const folder of eventsDir) {
  if (folder.endsWith(".js")) {
    const event = require(`../Events/${folder}`);
    event.path = `../Events/${folder}`;
    client.events.set(folder.replace(reg, ""), event);
  } else {
    const key = folder.replace(/Events/g, "");
    const eventFiles = fs.readdirSync(`./Files/Events/${folder}`);
    for (const file of eventFiles) {
      if (file.endsWith(".js") && file.startsWith(key)) {
        const event = require(`../Events/${folder}/${file}`);
        event.path = `../Events/${folder}/${file}`;
        client.events.set(file.replace(reg, ""), event);
      } else {
        if (file.startsWith(key) && !file.endsWith(".js")) {
          for (const eventFolderFile of fs.readdirSync(
            `./Files/Events/${folder}/${file}`
          )) {
            if (
              `${eventFolderFile}`.endsWith(".js") &&
              `${eventFolderFile}`.startsWith(key)
            ) {
              const event = require(`../Events/${folder}/${file}/${eventFolderFile}`);
              event.path = `../Events/${folder}/${file}/${eventFolderFile}`;
              client.events.set(eventFolderFile.replace(reg, ""), event);
            }
          }
        }
      }
    }
  }
}


client.prefix = process.env.PREFIX;


setInterval(() => {
  const activities_list = [
    { type: Discord.ActivityType.Listening, message: `${client.guilds.cache.size} Servers | Prefix ${client.prefix}` },
    { type: Discord.ActivityType.Listening, message: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Users | Prefix ${client.prefix}` },
    { type: Discord.ActivityType.Listening, message: `${client.guilds.cache.size} Servers | ${client.prefix}help` },
    { type: Discord.ActivityType.Listening, message: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Users | ${client.prefix}help` },
  ];

  const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);


  client.user.setActivity(activities_list[index].message, { type: activities_list[index].type });
}, 5000);


//Top.gg Stats
try {
  const ap = AutoPoster(process.env.TOPGG_TOKEN, client)

  ap.on('posted', (stats) => {
    const currentDate = new Date()
    console.log(`[${currentDate.toLocaleString()}][Mursy Systems] Posted stats to Top.gg! ${stats.serverCount}`)
  })

} catch (e) {
  errorLog(e)
}

client.login(process.env.DISCORD_TOKEN);

module.exports = client;
