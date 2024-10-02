const { description } = require("../reload");

module.exports = {
    name: 'back',
    description: "Returns to previously played song.",
    utilisation: '{prefix}back',
    howTo: `.back`,
    voiceChannel: true,

    async execute(client, message, cmd, args, Discord) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.node.isPlaying()) return message.channel.send(`${message.author}, There is no music currently playing! ❌`);

        // const previousTracks = queue.history.toArray();
        // if (previousTracks.length < 2) return message.channel.send(`\${message.author}, There was no music playing before ❌`);

        await queue.history.back();

        message.channel.send(`Previous music started playing... ✅`);
    },
};