/**
 * This is the entry point for your app
 * Include any assets to be bundled in here
 * (css/images/js/etc)
 */
// Exposing app to the backend
<% if (isButton) { %>
    let app = require('./scripts/<%= name%>');
<% } else { %>
    require('./styles/main.css');
    let app = require('./scripts/main');
<% } %>
module.exports = app;