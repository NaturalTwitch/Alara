module.exports = {
    name: "test",
    description: "Test Command",
    async execute(client, message, cmd, args, Discord) {
        const queue = client.player.nodes.get(message.guild.id);

        const vol = Number(args[0]);

        if (!queue) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);
        
        const success = queue.node.setVolume(vol)

        return message.channel.send(success ? `Volume was set to ${vol}%` : `${message.author}, Something went wrong.`)
    }
}