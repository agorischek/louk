const fs = require('fs');

require.extensions['.louk'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const parser = require("./parser")

//Turn verbose logging on or off
let logging = false

module.exports = function(content){
    let html = parser.parse(content, logging);
    return html
}
