require("dotenv").config()
const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(message) {
        const { client } = message;

        this.commandHandler(message, client);
        this.messageHandler(message, client);
    },
    async commandHandler(message, client) {
        const customPrefix = await getCustomPrefix(message, client);
        const { prefix } = client;
        if (customPrefix) {
            if (!message.content.startsWith(customPrefix) || message.author.bot) {
                return;
            }
        } else if (!message.content.startsWith(prefix) || message.author.bot) return;

        const usedPrefix = message.content.startsWith(prefix) ? prefix : customPrefix;
        const args = message.content.slice(usedPrefix.length).split(/ +/);
        const cmd = args.shift().toLowerCase();

        const command =
            client.commands.get(cmd) ||
            client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

        if (command) {
            command.execute(client, message, cmd, args, Discord)
        }
    },
    async messageHandler(message, client, args) {

    }
}

async function getCustomPrefix(message, client) {
    try {
        const response = await client.db.query(
            `SELECT prefix
            FROM prefix
            WHERE guild_id = $1`,
            [message.guild.id]
        );
        if (response && response.rowCount) return response.rows[0].prefix;
        return null;
    } catch (err) {
        return null;
    }
}