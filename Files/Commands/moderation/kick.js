const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "kick",
    description: "kicks user from guild",
    howTo: ".kick [user]",
    async execute(client, message, cmd, args, Discord) {
        const member = message.mentions.members.first();
        const user = message.mentions.users.first();

        let admin = message.author.username;
        let server = message.guild.name;

        let reason = args.join(" ").slice(22);
        if (!reason) reason = "No Reason Provided";

        let modlog = await getCustomChannel(message, client);
        let channel = message.guild.channels.cache.find((x) => (x.id === `${modlog}`));

        let kickReason = `Kicked by ${message.author.tag} for ${reason}`;

        const mentionEmbed = new Discord.EmbedBuilder()
            .setDescription(`Please remember to mention the user **(User Mention eg. <@643945264868098049>)**`)
            .setColor("#FFFF00")

        const noPermEmbed = new Discord.EmbedBuilder()
            .setDescription(`You don't have enough permissions to execute this command!`)
            .setColor("#FF0000")

        const nonBanEmbed = new Discord.EmbedBuilder()
            .setDescription(`Sorry but this user is not kicknable!`)
            .setColor(`#FF0000`)

        const kickEmbedDM = new Discord.EmbedBuilder()
            .setTitle(`You have been kicked from ${server}!`)
            .setThumbnail(`${message.guild.iconURL()}`)
            .addFields(
                {
                    name: 'Reason:',
                    value: `${reason}`
                }
            )
            .setFooter({
                text: `You were kicked by ${admin}`
            })
            .setTimestamp()
            .setColor(`#FF0000`)

        const kickSelf = `**${admin}**, you can't kick yourself!`;
        const kickBot = `**${admin}**, I can't kick myself!`;
        const kickAdmin = `**${admin}**, I can't kick Admins/Mods`;

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send({ embeds: [noPermEmbed] })
        if (!user) return message.channel.send({ embeds: [mentionEmbed] })

        if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {

            if (member.id === '1289739057265381406') {
                message.channel.send(kickBot)
                return;
            } else if (member.id === message.author.id) {
                message.channel.send(kickSelf)
                return;
            } else if (member.roles.cache.some(role => ['Administrator', 'Admin', 'Moderator', 'Mod', 'Owner'].includes(role.name))) {
                message.channel.send(kickAdmin)
                return;
            } else {
                if (!member.kickable) return message.channel.send({ embeds: [nonBanEmbed] })

                if (!!user && message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                    const userTarget = message.guild.members.cache.get(user.id)
                    const kickEmbedServer = new Discord.EmbedBuilder()
                        .setColor("#000000")
                        .setThumbnail(user.displayAvatarURL())
                        .setDescription(`<@${userTarget.user.id}> has been kicked!`)
                        .addFields({
                            name: 'Reason:',
                            value: `${reason}`
                        })
                        .setFooter({
                            text: `Banned by ${admin}`
                        })
                        .setTimestamp()

                    member.send({ embeds: [kickEmbedDM] })

                    setTimeout(() => {
                        member.kick({
                            reason: kickReason
                        }).catch(e => console.log(e)).then(() => {
                            if (!channel) {
                                message.channel.send({ embeds: [kickEmbedServer] }).then(m => {
                                    setTimeout(() => {
                                        m.delete()
                                    }, 5000)
                                    message.delete()
                                })
                            } else {
                                message.channel.send(`<@${userTarget.user.id}> has been kicked!`).then(m => {
                                    setTimeout(() => {
                                        m.delete()
                                    }, 5000)
                                    channel.send({ embeds: [kickEmbedServer] })
                                    message.delete()
                                })
                            }
                        })
                    }, 1000)
                }
            }
        } else {
            message.channel.send(`I don't have enough permmissions to execute this command! \`BAN_MEMBER\` `)
        }

    }
}

async function getCustomChannel(message, client) {
    const response = await client.db.query(`select channel_id from modlogs where guild_id = $1`, [message.guild.id])
    if (response && response.rowCount) return response.rows[0].channel_id
    return null;
}