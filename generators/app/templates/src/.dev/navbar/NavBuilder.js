<% if (!isButton && !isDriveAddin) { %>
import './navbar'; // Lay out the base to the main page;
<% } %>
<<<<<<< HEAD
import NavFactory from './NavFactory';
import NavHandler from './NavHandler';
import props from './props';
=======
let NavFactory = require('./NavFactory');
let NavHandler = require('./NavHandler');
let props = require('./props');
let language = localStorage.language ? localStorage.language : 'en';
>>>>>>> 58ba628... Linting

let factory = new NavFactory();
let handler = new NavHandler(factory, props);
<% if (!isButton && !isDriveAddin) { %>
handler.generateContent();
<% } %>
<% if (!isButton) { %>
    handler.enableDisplayToggle();
<% } %>