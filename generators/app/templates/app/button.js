geotab.customButtons.<%= root %> = function (event, api, state) {
  event.preventDefault();

  state.setState({
    hello: 'world'
  });

  // getting the current user to display in the UI
  api.getSession(session => {
    alert(`Hello ${session.userName}`);
  });
};
