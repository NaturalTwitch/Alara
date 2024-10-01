const { useMainPlayer } = require('discord-player');
const { QueryType } = require('discord-player');
const errorLog = require('../../Modules/errorlog.js');

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Plays a song in voice chat.',
    howTo: '.play [song/URL]',
    utilisation: '{prefix}play [song name/URL]',
    voiceChannel: true,

    async execute(client, message, cmd, args, Discord) {
        if (!args[0]) return message.channel.send(`${message.author}, Write the name of the music you want to search. ❌`);

        const player = useMainPlayer();
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(`${message.author}, You are not connected to a voice channel. ❌`);

        const searchResult = await player.search(args.join(' '), {
            requestedBy: message.member.user,
            searchEngine: QueryType.AUTO
        });



        if (!searchResult.hasTracks()) return message.channel.send(`${message.author}, No results found! ❌`);

        try {
            await player.play(voiceChannel, searchResult, {
                nodeOptions: {
                    metadata: {
                        channel: message.channel,
                        client: message.guild.members.me,
                        requestedBy: message.member.user,
                        guildId: message.guild.id
                    }
                }
            });
        } catch (error) {
            console.error(error);
            console.log(searchResult);
            errorLog(error)
            message.channel.send(`${message.author}, An error occurred while playing the track. ❌`);
            message.channel.send(`${error.stack}`)
        }
    },
};