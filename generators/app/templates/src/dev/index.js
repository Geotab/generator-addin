console.log("index dev");
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
global.state = require("./state");
global.geotab = {
    addin: {}, 
    customButtons: {}, 
    isDriveAddin: <%= isDriveAddin || false %>
}
// Importing the app rules -> Where addin will be described
let app = require("../app/index");

// Importing dev-specific packages
import "./rison";
import "./login/loginTemplate.js";
import GeotabLogin from "./login/loginLogic";
import GeotabApi from  './api';
const loginLogic = new GeotabLogin(global.geotab.isDriveAddin, GeotabApi);
<% if (!isDriveAddin) { %>
import "./navbar/navBuilder";
<% } %>
