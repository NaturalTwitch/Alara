const fs = require('fs');

module.exports = (error) => {
    const currentDate = new Date();
    const timestamp = currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' });

    if (error.stack) {
        const errorStack = error.stack.replace(/(\r\n|\n|\r)/gm, "\n- ");
        const errorString = `[${timestamp}]\n${error.name}: ${error.message}\nRequire stack:\n- ${errorStack}\n`;
        fs.appendFileSync('errorlog.txt', `${errorString}\n`);
        console.error(errorString);
    } else {
        const errorString = `[${timestamp}]\nError : ${error}\nRequire Stack:\n- NULL\n`;
        fs.appendFileSync('errorlog.txt', `${errorString}\n`);
        console.error(errorString);
    }
}