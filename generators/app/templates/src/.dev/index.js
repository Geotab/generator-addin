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
import Translator from './lang/Translator';
let language = localStorage.language ? localStorage.language : 'en';
global.translator = new Translator('#<%= root%>', language);
<% } %>
// Global Translate function
global.state.translate = function(target, language) {
    
    // First translation from initialize doesn't pass a language in. Will cause problems is language is undefined
    if (typeof language !== 'undefined'){
        localStorage.language = language;
        location.reload();
    }

    // Primary behaviour passes HTMLElement, but function needs to support string translation as well
    if (typeof target === 'string'){
        // Do translation
        let translation = global.translator.translateSentence(target);
        // return translated string
        return translation;
    }
}

/* Logic */
const loginLogic = new GeotabLogin(global.geotab.isDriveAddin, GeotabApi);

<% if (!isButton && !isDriveAddin) {%>
// Building translation hierarchy
require('./lang/languages');

/* Group Filter Module */
window.conditions = {}
import GroupListeners from './groups/GroupListeners.js';
let groupListener = new GroupListeners(global.api, global.state, 'original_filter', 'filter-dropdown', 'group-dropdown', 'group-input', 'group-toggle-button', 'group-remove-all', 'active-group');
groupListener.assignEventListeners();

import'./advancedGroupFilter/advancedGroupFilter.js'
import AdvancedGroupFilterListener from './advancedGroupFilter/advancedGroupFilterListener.js';
let filterListener = new AdvancedGroupFilterListener()
filterListener.assignListeners()

<% } %>
<% if (!isButton) {%>
// Handling the blur toggle
require('./ToggleHandler');
<% } %>
<% if (isButton) { %>
    let config = require('../config.json');
    let icon = document.querySelector('.icon');
    icon.style['background-image'] = `url(src/${config.items[0].icon})`;
<% } %>
<% if (!isButton && !isDriveAddin) { %>
// Setting up mock display panel
let mainPanel = document.querySelector('#<%= root%>');
mainPanel.id = 'checkmateContent';
mainPanel.className = 'centerPane';
mainPanel.style.top = '40px';
mainPanel.style.left = '250px';
<% } %>

// Setup complete
/* Addin Logic */
require('../app/index');
