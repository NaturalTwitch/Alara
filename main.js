const Discord = require('discord.js');
const client = require('./Files/Client/DiscordClient.js');
const errorLog = require('./Files/Modules/errorlog.js');

const { Player } = require(`discord-player`);
const { ExtractorModel } = require('@discord-player/extractor');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { EmbedBuilder } = require('discord.js')

client.config = require('./config');
client.player = new Player(client, {
  ...client.config.opt.discordPlayer,
  extractorModel: ExtractorModel,
})

const player = client.player;
player.extractors.register(YoutubeiExtractor, {
  authentication: process.env.YOUTUBE_TOKEN
})
client.player.extractors.loadDefault();


player.events.on('error', (queue, error) => {
  console.log(`There was a problem with the song queue => ${error.message}`);
});

player.events.on('connectionError', (queue, error) => {
  console.log(`I'm having trouble connecting => ${error.message}`);
  queue.metadata.channel.send('An Error has Occured Please Try Again')

  const success = queue.skip();
});


player.events.on('playerStart', (queue, track) => {
  const trackStart = new EmbedBuilder()
    .setDescription(`🎵 Now Playing: **${track.title}**🎧`)
    .setImage(`${track.thumbnail}`)
  if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
  queue.metadata.channel.send({ embeds: [trackStart] });
});

player.events.on('audioTracksAdd', (queue, tracks) => {
  const trackTitles = tracks.map(track => `**${track.title}**`).join(', ');
  const tracksAdd = new EmbedBuilder()
    .setDescription(`Added ${trackTitles} to the queue.`)
  queue.metadata.channel.send({ embeds: [tracksAdd] });
});


player.events.on('audioTrackAdd', (queue, track) => {
  const trackAdd = new EmbedBuilder()
    .setDescription(`Added **${track.title}** to the queue.`)
  queue.metadata.channel.send({ embeds: [trackAdd] });
});


player.events.on('channelEmpty', (queue) => {
  queue.metadata.channel.send('The voice channel was empty, so I left');
});




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