module.exports = {
    name: "ban",
    description: "bans user from guild",
    async execute(client, message, cmd, args, Discord) {
        const member = message.mentions.members.first();
        const user = message.mentions.users.first();

        let admin = message.author.username;
        let server = message.guild.name;

        let reason = args.join(" ").slice(22);
        if (!reason) reason = "No Reason Provided";

        let modlog = await getCustomChannel(message, client);
        let channel = message.guild.channels.cache.find((x) => (x.id === `${modlogs}`));

        let banReason = `Kicked by ${message.author.tag} for ${reason}`;

        const mentionEmbed = new Discord.EmbedBuilder()
        .setDescription(`Please remember to mention the user **(User Mention eg. <@643945264868098049>)**`)
        .setColor("#FFFF00")

        const noPermEmbed = new Discord.EmbedBuilder()
        .setDescription(`You don't have enough permissions to execute this command!`)
        .setColor("#FF0000")

        const nonBanEmbed = new Discord.EmbedBuilder()
        .setDescription(`Sorry but this user is not bannable!`)
        .setColor(`#FF0000`)

        const banEmbed = new Discord.EmbedBuilder()
        .setTitle(`You have been banned from ${server}!`)
        .setThumbnail(`${message.guild.iconURL()}`)
        .addFields(
            {
                name: 'Reason:',
                value: `${reason}`
            }
        )
        .setFooter({
            text: `You were banned by ${admin}`
        })
        .setTimestamp()
        .setColor(`#FF0000`)

        const banSelf = `**${admin}**, you can't ban yourself!`;
        const banBot = `**${admin}**, I can't ban myself!`;
        const banAdmin = `**${admin}**, I can't ban Admins/Mods`;
        
    }
}