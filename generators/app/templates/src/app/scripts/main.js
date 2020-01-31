console.log("main.js");
/**
 * @returns {{initialize: Function, focus: Function, blur: Function}}
 */
geotab.addin.<%= root%> = function () {
  'use strict';

  // the root container
  var elAddin = document.getElementById("<%= root%>");

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
    // MUST call initializeCallback when done any setup
      initializeCallback();
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
            elAddin.className = '';
          }, err => {
            console.error(err);
          });
        });<% } else { %>
      // getting the current user to display in the UI
      freshApi.getSession(session => {
        elAddin.querySelector('#<%= root%>-user').textContent = session.userName;
      });

      // show main content
      elAddin.className = '';
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
      elAddin.className = 'hidden';
    }
  };
};
