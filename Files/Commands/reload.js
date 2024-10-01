const { EmbedBuilder } = require("discord.js")
const errorLog = require('../Modules/errorlog.js');

module.exports = {
  name: 'reload',
  aliases: ['r'],
  description: 'Reloads Command Files',
  execute(client, message, cmd, args, Discord){
    if(message.author.id !== '513413045251342336' && message.author.id !== '318453143476371456') return message.channel.send(`You don't have authorization to access this command`)
  //  if(args[0] === 'music') return;

    try{
      if(args[0] === 'events'){
        delete require.cache[require.resolve(`../Events/${args[1]}`)];
        const newCommand = require(`../Events/${args[1]}`);
        client.events.set(newCommand);


      } else {
        delete require.cache[require.resolve(`./${args[0]}`)];
        const newCommand = require(`./${args[0]}`);
        client.commands.set(newCommand.name, newCommand);
      }


    } catch (e) {
    if(args[0] === 'events'){
      const errorEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle('Reloading')
      .setDescription(`${args[1]} event couldn't be reloaded ☹️`)

      console.log(e)
      errorLog(e)
    return message.channel.send({embeds: [errorEmbed]})
    } else {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle('Reloading')
        .setDescription(`${args[0]} command couldn't be reloaded ☹️`)

        console.log(e)
        errorLog(e)
      return message.channel.send({embeds: [errorEmbed]})
      }
    }
if(args[0] === 'events'){
  const successfulEmbed = new EmbedBuilder()
    .setColor('#00ff00')
    .setTitle('Reloading')
    .setDescription(`${args[1]} event was successfully reloaded 😄`)
    message.channel.send({embeds: [successfulEmbed]})

} else {
    const successfulEmbed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('Reloading')
      .setDescription(`${args[0]} command was successfully reloaded 😄`)
    message.channel.send({embeds: [successfulEmbed]})
    }
  }
}
