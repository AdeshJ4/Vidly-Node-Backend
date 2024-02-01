const config = require('config');
const debug = require("debug")("app:startup");

module.exports = function () {
    if(!config.get('jwtPrivateKey')){
        debug('FATAL ERROR: jwrPrivateKey id not defined');
        process.exit(1);  // forcefully, abnormal terminate the Node.js process
    }
}
