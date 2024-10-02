const { EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');
const errorLog = require('../../Modules/errorlog.js');
const { description } = require('./resume.js');

module.exports = {
  name: 'progress',
  aliases: ["time"],
  description: "See how much longer a song is playing",
  howTo: ".progress",
  utilisation: '{prefix}progress',
  voiceChannel: true,

  async execute(client, message, cmd, args, Discord) {

    try {
      const queue = client.player.nodes.get(message.guild.id);


      if (!queue || !queue.node.isPlaying()) return message.channel.send(`${message.author}, There is no music currently playing!`);

      const progress = queue.node.createProgressBar();;
      

      const currentTimestamp = queue.node.getTimestamp().current.value;

      const track = queue.currentTrack;

      if (currentTimestamp == 'Infinity') return message.channel.send(`This song is live streaming, no duration data to display. 🎧`);

      const progressEmbed = new EmbedBuilder()
        .setColor(`000000`)
        .setTitle(`${track.title}`)
        .setImage(`${track.thumbnail}`)
        .setDescription(`${progress}`)

      message.channel.send({ embeds: [progressEmbed] });
    } catch (e) {
      console.log(e);
      errorLog(e)
      return
      
    }
  },
};
