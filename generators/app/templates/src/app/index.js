console.log("index app")
/**
 * This is the entry point for your app
 * Include any assets to be bundled in here
 * (css/images/js/etc)
 */
require('./styles/main.css');

// Exposing app to the backend
let app = require('./scripts/main');
module.exports = app;