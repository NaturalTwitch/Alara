module.exports = {
    name: 'help',
    aliases: ['cmd'],
    description: `Shows what commands the bot has.`,
    howTo: ".help \n .help [cmd] to show what the command does.",
    async execute(client, message, cmd, args, Discord) {
        const command = client.commands.get(args[0]);

        if (!command) {
            // Group commands by categories
            const categorizedCommands = {};
            client.commands.forEach(cmd => {
                const category = cmd.category || 'Uncategorized'; // Ensure every command has a category
                if (!categorizedCommands[category]) {
                    categorizedCommands[category] = [];
                }
                categorizedCommands[category].push(cmd);
            });

            // Generate select menu options based on categories
            const categoryOptions = Object.keys(categorizedCommands).map(category => ({
                label: capitalizeFirstLetter(category),
                value: category.toLowerCase() // Set category as value for identification
            }));

            const menu = new Discord.StringSelectMenuBuilder()
                .setCustomId(`Help_Menu`)
                .setPlaceholder("Help Categories...")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(categoryOptions);

            const defaultEmbed = new Discord.EmbedBuilder()
                .setColor(`#000000`)
                .setTitle(`Alara Help Menu`)
                .setDescription("[Support Server](https://discord.gg/3beHZ6c2HV) | Prefix `.`")
                .addFields({
                    name: `**__How to use:__**`,
                    value: `To select your help category, use the drop-down menu. This embed will change to display the commands for that category.`,
                })
                .setFooter({
                    text: `Support Alara on [Patreon](https://www.patreon.com/MursyDiscord)`
                });

            // Send the menu with the default help embed
            const row = new Discord.ActionRowBuilder().addComponents(menu);
            const helpMessage = await message.channel.send({ embeds: [defaultEmbed], components: [row] });

            // Set up an interaction collector to listen for menu selections
            const filter = (interaction) => interaction.customId === 'Help_Menu' && interaction.user.id === message.author.id;
            const collector = helpMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (interaction) => {
                const selectedCategory = interaction.values[0].toLowerCase(); // Get selected category
                const commandsInCategory = categorizedCommands[selectedCategory] || [];

                if (commandsInCategory.length === 0) {
                    await interaction.deferUpdate();
                    await helpMessage.edit({
                        content: `No commands found in the category **${capitalizeFirstLetter(selectedCategory)}**.`,
                        embeds: [],
                        components: []
                    });
                    return;
                }

                // Generate an embed showcasing the commands in the selected category
                const categoryEmbed = new Discord.EmbedBuilder()
                    .setColor(`#000000`)
                    .setTitle(`${capitalizeFirstLetter(selectedCategory)} Commands`)
                    .setDescription("[Support Server](https://discord.gg/dFBKKPB8Y3) | Prefix `.`")
                    .addFields(
                        commandsInCategory.map(cmd => ({
                            name: capitalizeFirstLetter(cmd.name),
                            value: cmd.description || 'No description available.',
                            inline: true
                        }))
                    );

                await interaction.deferUpdate();
                await helpMessage.edit({ embeds: [categoryEmbed], components: [] });
            });

            return;
        }

        // Fallback: If a command is directly requested by name
        const name = command.name;
        const cmdaliases = command.aliases ? command.aliases.join(', ') : 'None';
        const description = command.description || 'No description available.';
        const category = command.category || 'Uncategorized';
        const howTo = command.howTo || "No example was found"

        const cmdShowcase = new Discord.EmbedBuilder()
            .setColor(`#000000`)
            .setTitle(capitalizeFirstLetter(name))
            .addFields(
                { name: `Aliases`, value: cmdaliases },
                { name: `Description`, value: capitalizeFirstLetter(description) },
                { name: `How to Use:`, value: capitalizeFirstLetter(howTo) },
                { name: `Category`, value: capitalizeFirstLetter(category) }
            );

        message.channel.send({ embeds: [cmdShowcase] });
    }
};

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    if (!string) return ''; // Handle empty strings
    return string.charAt(0).toUpperCase() + string.slice(1);
}
