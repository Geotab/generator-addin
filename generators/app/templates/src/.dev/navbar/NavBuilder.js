<% if (!isButton && !isDriveAddin) { %>
require('./navbar'); // Lay out the base to the main page;
<% } %>
let NavFactory = require('./NavFactory');
let NavHandler = require('./NavHandler');
let props = require('./props');
let language = localStorage.language ? localStorage.language : 'en';

let factory = new NavFactory(language);
let handler = new NavHandler(factory, props);
<% if (!isButton && !isDriveAddin) { %>
handler.updateMenuItem();
handler.generateContent();
<% } %>
<% if (!isButton) { %>
// handler.enableDisplayToggle();
<% } %>