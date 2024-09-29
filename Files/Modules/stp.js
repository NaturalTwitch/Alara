require('dotenv').config();

module.exports = (expression, obj) => {
    const text = (e) => {
     const t = e.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring, value) => {
      const newValue = value.split('.');
      let decided;
      const Result = obj[newValue[0]];
      if (Result) {
       if (newValue.length > 1) {
        newValue.forEach((element, i) => {
         if (i === 1) decided = Result[element];
         if (i > 1) decided = decided[element];
        });
        return decided;
       }
       return Result;
      }
      return substring;
     });
     return t;
    };
    return text(expression).replace(RegExp(process.env.DISCORD_TOKEN, 'g'), 'TOKEN');
   };