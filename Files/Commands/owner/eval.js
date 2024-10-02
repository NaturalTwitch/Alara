const Discord = require('discord.js')

module.exports = {
  name: 'evaluate',
  aliases: ['eval'] ,
  description: "Evaluate/Test Code to ensure its correct. \n !Only Works for Bot Owner!",
  howTo: ".evaluate [javascriptCode]",
  async execute(client, message, cmd, args){
    const clean = async (text) => {
    // If our input is a promise, await it before continuing
    if (text && text.constructor.name == "Promise")
      text = await text;

    // If the response isn't a string, `util.inspect()`
    // is used to 'stringify' the code in a safe way that
    // won't error out on objects with circular references
    // (like Collections, for example)
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });

    // Replace symbols with character code alternatives
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));

    // Send off the cleaned up result
    return text;
  }


  let admin = message.author.username;
  let user = message.mentions.users.first();



  if(message.author.id === '513413045251342336' || message.author.id === '318453143476371456' || message.author.id === '645703827655360578'){


// In case something fails, we to catch errors
// in a try/catch block
try {
  // Evaluate (execute) our input
  const evaled = eval(args.join(" "));
  const cleaned = await clean(evaled);
  message.channel.send(`[Mursy] \`\`\`js\n${cleaned}\n\`\`\``);

} catch (err) {

  message.channel.send(`[Mursy] \`\`\`${err}\`\`\``);

  const evaled = eval(args.join(" "));
  const cleaned = await clean(evaled);


}
} else {
  message.reply(`sorry but you cant access this`)
}

// End of our message event handler
}
};

