/**
 * The function is called whenever the Add-In button is clicked.
 *
 * @param {object} event - The event dispatched from the button click.
 * @param {object} api - The GeotabApi object for making calls to MyGeotab.
 * @param {object} state - The page state object allows access to URL, page navigation and global group filter.
 */
geotab.customButtons.<%= root %> = (event, api, state) => {
  'use strict';

  event.preventDefault();

  state.setState({
    hello: 'world'
  });

  // getting the current user to display in the UI
  api.getSession(session => {
    console.log(`Hello ${session.userName}`);
  });
};
