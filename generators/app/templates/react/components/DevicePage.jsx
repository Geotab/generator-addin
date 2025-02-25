import React, { useState, useEffect, useContext } from 'react';
import GeotabContext from '../contexts/Geotab';

const DevicePage = () => {
  const [context] = useContext(GeotabContext);
  const [devices, setDevices] = useState([]);

  const { geotabApi, logger } = context;

  useEffect(() => {
    geotabApi.call('Get', {
      typeName: 'Device',
    }, (result) => {
      logger.log(`Loaded ${result.length} devices`);
      setDevices(result);
    }, (error) => {
      logger.error(error);
    });
  }, []);

  return (
    <div>
      <div className="geotabPageHeader">
        <h1 className="geotabPageName">
          Devices
        </h1>
      </div>
      <div className="geotabSecondaryFill">
        <ul>
          {devices.map((device) => <li key={device.id}>{device.name}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default DevicePage;
