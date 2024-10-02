const { description } = require("../reload");

module.exports = {
    name: 'pause',
    description: "pauses current music",
    howTo: ".pause",
    utilisation: '{prefix}pause',
    voiceChannel: true,

    execute(client, message, cmd, args, Discord) {
        const queue = client.player.nodes.get(message.guild.id);

       if (!queue || !queue.node.isPlaying()) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

        const success = queue.node.pause();

        return message.channel.send(success ? `The currently playing music named **${queue.currentTrack.title}** has stopped ✅` : `${message.author}, Something went wrong. ❌`);
    },
};