module.exports = {
    name: "test",
    description: "Test Command",
    async execute(client, message, cmd, args, Discord){
        message.channel.send(`Hello World!`)
    }
}