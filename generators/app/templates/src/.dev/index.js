/**
 * Entry point for serving the app on localhost
 * Allows several UI features to be displayed to improve
 * development without adding them in to the final
 * build sent to production
 * 
 * ******************** NOTE ********************
 * 
 *  Any features built into this file will not be included in
 * the addin build. Any changes you want included should be in
 * app/index.js instead.
 * 
 * **********************************************
 */

// Allowing babel to work with older versions of IE
const regeneratorRuntime = require('regenerator-runtime');

// Global object is used to simulate the api, state, and geotab objects
global.api
global.state = require('./state');
global.geotab = {
    addin: {}, 
    customButtons: {}, 
    isDriveAddin: <%= isDriveAddin || false %>
}
// Importing the app rules -> Where addin will be described
<% if (isButton) {%>
require('../app/scripts/<%= root%>');
<% } else { %>
require('../app/scripts/main');
<% } %>
// Importing dev-specific packages
import './rison';
import './login/loginTemplate.js';
import GeotabLogin from './login/loginLogic';
import GeotabApi from './api';

// Building navbar
// Exposing handler to let the translate function have access to it
import './navbar/NavBuilder';
<% if (!isButton && !isDriveAddin) {%>
/* Translations */
import DOMTree from './lang/DOMTree';
let language = localStorage.language ? localStorage.language : 'en';
global.tree = new DOMTree('#app', language);
<% } %>
/* Logic */
const loginLogic = new GeotabLogin(global.geotab.isDriveAddin, GeotabApi);

// Global Translate function
global.state.translate = function(addin, language) {
    localStorage.language = language;
    location.reload();
}
<% if (!isButton && !isDriveAddin) {%>
// Building translation hierarchy
require('./lang/languages');
<% } %>
// Handling the blur toggle
require('./ToggleHandler');
<% if (isButton) { %>
    let config = require('../app/config.json');
    let icon = document.querySelector('.icon');
    icon.style['background-image'] = `url(src/app/${config.items[0].icon})`;
<% } %>
<% if (!isButton && !isDriveAddin) { %>
// Setting up mock display panel
let mainPanel = document.querySelector('#app');
mainPanel.id = 'checkmateContent';
mainPanel.className = 'centerPane';
mainPanel.style.top = '40px';
mainPanel.style.left = '250px';
<% } %>

// Setup complete
/* Addin Logic */
require('../app/index');
