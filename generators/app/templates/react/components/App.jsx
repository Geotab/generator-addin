import React, { useState } from 'react';
<% if(isZenithBased) {%>
<% if(isDriveAddin) {%>
import DutyStatusLogs from './DutyStatusLogs.jsx';
<%} else {%>
import DevicesPage from './DevicesPage.jsx';
<%}%>
<%} else {%>
import DevicePage from './DevicePage.jsx';
<%}%>
import GeotabContext from '../contexts/Geotab';
import Logger from '../utils/logger';
<% if(isZenithBased) {%>
import '@geotab/zenith/dist/index.css'
<%}%>

const App = ({ geotabApi, geotabState, appName }) => {
  const logger = Logger(appName);
  const [context, setContext] = useState({ geotabApi, geotabState, logger });

  return (
    <>
      <GeotabContext.Provider value={[context, setContext]}>
        <% if(isZenithBased) {%>
        <% if(isDriveAddin) {%>
        <DutyStatusLogs />
        <%} else {%>
        <DevicesPage />
        <%}%>
        <%} else {%>
        <DevicePage />
        <%}%>
      </GeotabContext.Provider>
    </>
  );
};

export default App;
