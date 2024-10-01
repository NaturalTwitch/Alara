
module.exports = {
    name: 'help',
    aliases: ['cmd'],
    description: `Shows Commands`,
    async execute(client, message, cmd, args, Discord) {
        const command = client.commands.get(args[0]);

        if (!command) {
            return message.channel.send('Command not found. Please provide a valid command name.');
        }

        const name = command.name;
        const cmdaliases = command.aliases ? command.aliases.join(', ') : 'None';
        const description = command.description || 'No description available.';
        const category = command.category || 'Uncategorized';

        const cmdShowcase = new Discord.EmbedBuilder()
            .setColor(`#000000`)
            .setTitle(capitalizeFirstLetter(name))
            .addFields(
                { name: `Aliases`, value: cmdaliases },
                { name: `Description`, value: capitalizeFirstLetter(description) },
                { name: `Category`, value: capitalizeFirstLetter(category) }
            );

        message.channel.send({ embeds: [cmdShowcase] });
    }
};

function capitalizeFirstLetter(string) {
    if (!string) return ''; // Handle empty strings
    return string.charAt(0).toUpperCase() + string.slice(1);
}
