
module.exports = {
    name: 'help',
    aliases: ['cmd'],
    description: `Shows Commands`,
    async execute(client, message, cmd, args, Discord) {
        const command = client.commands.get(args[0])

        console.log(command)

        const name = command.name;
        const cmdaliases = command.aliases || null;
        const description = command.description;
        const category = command.category;

        if (command) {
            const cmdShowcase = new Discord.EmbedBuilder()
                .setColor(`#000000`)
                .setTitle(name)
                .addFields({
                    name: `Aliases`,
                    value: cmdaliases,
                },
                    {
                        name: `Descripition`,
                        value: description
                    },
                    {
                        name: `Catergory`,
                        value: category
                    }
                )

            message.channel.send({ embeds: [cmdShowcase] })
        }
    }
}

module.exports = {
    name: 'help',
    aliases: ['cmd'],
    description: `Shows Commands`,
    async execute(client, message, cmd, args, Discord) {
        const command = client.commands.get(args[0])

        console.log(command)

        const name = command.name;
        const cmdaliases = command.aliases || null;
        const description = command.description;
        const category = command.category;

        if (command) {
            const cmdShowcase = new Discord.EmbedBuilder()
                .setColor(`#000000`)
                .setTitle(name)
                .addFields({
                    name: `Aliases`,
                    value: cmdaliases,
                },
                    {
                        name: `Descripition`,
                        value: description
                    },
                    {
                        name: `Catergory`,
                        value: category
                    }
                )

            message.channel.send({ embeds: [cmdShowcase] })
        }
    }
}