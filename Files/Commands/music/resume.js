module.exports = {
    name: 'resume',
    description: "Continue your music playback.",
    howTo: ".resume",
    utilisation: '{prefix}resume',
    voiceChannel: true,

    execute(client, message, cmd, args, Discord) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

        const success = queue.node.resume();

        return message.channel.send(success ? `**${queue.currentTrack.title}**, The song continues to play. ✅` : `${message.author}, Something went wrong. ❌`);
    },
};