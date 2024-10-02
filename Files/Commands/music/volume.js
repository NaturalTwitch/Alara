
module.exports = {
    name: 'volume',
    aliases: ['vol'],
    description: "Sets volume of the bot.",
    howTo: ".volume [1-100]",
    async execute(client, message, cmd, args, Discord) {
        const queue = client.player.nodes.get(message.guild.id);

        const vol = Number(args[0]);

        if (!queue) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);
        if (!vol || vol === NaN) return message.channel.send(`${message.author} Please ensure you select add a number.`);
        if (vol < 1 || vol > 100) return message.channel.send(`${message.author} You can only set volume between 1% & 100%`);


        const success = queue.node.setVolume(vol)

        client.db.query(`
            INSERT INTO volume (guild_id, volume_percentage) 
            VALUES ($1, $2)
            ON CONFLICT (guild_id)
            DO UPDATE SET volume_percentage = $2;
            `,
            [message.guild.id, vol]
        )

        return message.channel.send(success ? `Volume was set to ${vol}%` : `${message.author}, Something went wrong.`)

    }
}