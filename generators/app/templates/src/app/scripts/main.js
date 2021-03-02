/**
 * @returns {{initialize: Function, focus: Function, blur: Function, startup; Function, shutdown: Function}}
 */
const config = require('../../app/config.json');
geotab.addin.<%= root%> = function () {
  'use strict';

  <% if (isDriveAddin) { %>
    // the root container
    var elAddin = document.getElementById('app');
  <% } else { %>  
    // the root container
    var elAddin = document.getElementById('<%= root%>');
  <% } %>
  return {
    /**
     * initialize() is called only once when the Add-In is first loaded. Use this function to initialize the
     * Add-In's state such as default values or make API requests (MyGeotab or external) to ensure interface
     * is ready for the user.
     * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
     * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
     * @param {function} initializeCallback - Call this when your initialize route is complete. Since your initialize routine
     *        might be doing asynchronous operations, you must call this method when the Add-In is ready
     *        for display to the user.
     */
    initialize: function (freshApi, freshState, initializeCallback) {
    // Loading translations if available
    if (freshState.translate) {
      freshState.translate(elAddin || '');
    }
    // MUST call initializeCallback when done any setup
      initializeCallback();
    },
    /**
     * Startup Add-Ins are executed when a driver logs in to the Drive App for the first time. 
     * When the dashboard page is visible, the startup method is only called once. 
     * If the user navigates away from the page then navigates back, the startup method is not called again. I
     * f the Add-In requires re-initialization, the user must either log out and log in again, or refresh the application.
     * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
     * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
     * @param {function} initializeCallback - Call this when your initialize route is complete. Since your initialize routine
     *        might be doing asynchronous operations, you must call this method when the Add-In is ready
     *        for display to the user.
    */
   startup: function (freshApi, freshState, initializeCallback) {
    if(config.onStartup == true){
        elAddin.querySelector('#<%= root %>-startstop').textContent = 'Executing startup';
        setTimeout(() => {
          elAddin.querySelector('#<%= root %>-startstop').textContent = '';
        }, 2000);
        
        // MUST call initializeCallback when done any setup
          initializeCallback();
      }
    },
  /**
   * Shutdown Add-Ins are executed when the final driver logs out of the Drive App. 
   * If there are co-drivers, and one of the co-drivers logs out (while other drivers remain logged in to the Drive App), 
   * the shutdown Add-In is not executed. 
   * Additionally, the Add-In is expected to return a promise since shutdown Add-Ins have a 15-second time limit 
   * to perform their function before the Add-Ins time out and the logout process is completed. 
   * The time limit prevents the application from freezing in the middle of the logout process as a result of faulty Add-Ins.
   * @param {object} api - The GeotabApi object for making calls to MyGeotab.
   * @param {object} state - The page state object allows access to URL, page navigation and global group filter.
   * @param {function} resolve - call this somewhere so the promise resolves
  */
 shutdown: function (api, state, callback) {
  if(config.onShutdown == true){
    // alert that shutdown is executed      
    return new Promise (resolve => {
      // Do work, make any api calls etc    
      elAddin.querySelector('#<%= root %>-startstop').textContent = 'Executing shutdown';
    setTimeout(() => {
      elAddin.querySelector('#<%= root %>-startstop').textContent = '';
    }, 2000);   
      resolve(); // eventually need to call this somewhere so the promise resolves
    });
  }
},

    /**
     * focus() is called whenever the Add-In receives focus.
     *
     * The first time the user clicks on the Add-In menu, initialize() will be called and when completed, focus().
     * focus() will be called again when the Add-In is revisited. Note that focus() will also be called whenever
     * the global state of the MyGeotab application changes, for example, if the user changes the global group
     * filter in the UI.
     *
     * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
     * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
     */
    focus: function (freshApi, freshState) {
      <% if (isDriveAddin) { %> // getting the current user to display in the UI
        freshApi.getSession(session => {
          freshApi.call('Get', {
            typeName: 'Device',
            search: {
              id: freshState.device.id
            }
          }, result => {
            let device = result[0];
  
            elAddin.querySelector('#<%= root %>-driver').textContent = session.userName;
            elAddin.querySelector('#<%= root %>-vehicle').textContent = device.name;
  
            // show main content
            elAddin.className = elAddin.className.replace('hidden', '').trim();
          }, err => {
            console.error(err);
          });
        });<% } else { %>
          // getting the current user to display in the UI
          freshApi.getSession(session => {
            elAddin.querySelector('#<%= root%>-user').textContent = session.userName;
          });
          
          
          elAddin.className = '';
      // show main content
      <% } %>
    },

    /**
     * blur() is called whenever the user navigates away from the Add-In.
     *
     * Use this function to save the page state or commit changes to a data store or release memory.
     *
     * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
     * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
     */
    blur: function () {
      // hide main content
      elAddin.className += ' hidden';
    }
  };
};
