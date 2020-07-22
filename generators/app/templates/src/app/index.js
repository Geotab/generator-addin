/**
 * This is the entry point for your app
 * Include any assets to be bundled in here
 * (css/images/js/etc)
 */

// Allowing babel to work with older versions of IE
const regeneratorRuntime = require('regenerator-runtime');

if(!geotab.addin.<%= root%>){
    <% if(isButton) {%>
    require('./scripts/<%= root%>');
    <% } else { %>
    require('./scripts/main');
    <% } %>
}
<% if (!isButton) { %>
require('./styles/main.css');
<% } %>