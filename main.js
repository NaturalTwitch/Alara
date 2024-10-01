const Discord = require('discord.js');
const client = require('./Files/Client/DiscordClient.js');
const errorLog = require('./Files/Modules/errorlog.js');

// eslint-disable-next-line no-undef
process.setMaxListeners(3);

for (const rawevent of [...client.events.entries()]) {
  const event = client.events.get(rawevent[0]);
  if (event.once) client.once(rawevent[0], (...args) => event.execute(...args));
  else client.on(rawevent[0], (...args) => event.execute(...args));
}

// eslint-disable-next-line no-undef
process.on('unhandledRejection', (error) => {
  errorLog(error);
});
// eslint-disable-next-line no-undef
process.on('uncaughtException', (error) => {
  errorLog(error)
});