const fs = require('fs');

/**
 * Logs the error to a file and a logger.
 * @param {Error} error - The error object to be logged.
 * @param {Object} logger - The logger object to be used for logging.
 */

const errorLogger = (error, logger) => {
    const currentDate = new Date();
    const timestamp = currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' });

    if (!error.stack) {
        const errorString = `[${timestamp}]\nError : ${error}\nRequire Stack:\n- NULL\n`;
        fs.appendFileSync('../../errorlog.txt', `${errorString}\n`);
        console.log(errorString);
    } else {
            
        const errorStack = error.stack.replace(/(\r\n|\n|\r)/gm, "\n- ");
        const errorString = `[${timestamp}]\n${error.name}: ${error.message}\nRequire stack:\n- ${errorStack}\n`;
        fs.appendFileSync('../../errorlog.txt', `${errorString}\n`);
        console.log(errorString);
    }
}

module.exports = errorLogger;

