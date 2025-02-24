import React, { useState, useEffect, useContext, useMemo } from 'react';
import GeotabContext from '../contexts/Geotab';

import {
  ButtonType,
  IconLink2,
  IconLocationMap,
  IconPackage2,
  Header,
  Menu,
  Table
} from '@geotab/zenith'

const DevicesPage = () => {
  const [context] = useContext(GeotabContext);
  const [devices, setDevices] = useState([]);

  const { geotabApi, logger } = context;

  useEffect(() => {
    geotabApi.call('Get', {
      typeName: 'Device',
    }, (result) => {
      logger.log(`Loaded ${result.length} devices`);
      logger.log(result);
      setDevices(result);
    }, (error) => {
      logger.error(error);
    });
  }, []);

  const columns = useMemo(() => [{
    id: "col1",
    title: "Name",
    meta: {
      defaultWidth: 200
    }
  }, {
    id: "col2",
    title: "Serial Number",
    meta: {
      defaultWidth: 200
    }
  }, {
    id: "col3",
    title: "License Plate",
    meta: {
      defaultWidth: 200
    }
  }, {
    id: "col4",
    title: "Asset Type",
    meta: {
      defaultWidth: 200
    }
  }], []);
  const entities = useMemo(() => devices.map((device, index) => {
    console.log('Device info', device);

    return {
      id: index.toString(),
      col1: device.name,
      col2: device.serialNumber ? device.serialNumber : "############",
      col3: device.licensePlate ? device.licensePlate : "############",
      col4: device.deviceType
    }
  }), [devices]);

  return (
    <div>
      <Header>
        <Header.Title pageName='Assets'></Header.Title>
        <Header.Menu id="menu1" name="Links" icon={IconLink2} type={ButtonType.Secondary} >
          <Menu.Item id="item1" name="Assets" icon={IconPackage2} link='#devices,sortMode:byName' />
          <Menu.Item id="item2" name="Map" icon={IconLocationMap} link='#map,liveVehicleIds:all' />
        </Header.Menu>
      </Header>
      <div style={{ height: "500px" }}>
        <Table description="Fleet Assets" columns={columns} entities={entities}></Table>
      </div>
    </div >
  );
};

export default DevicesPage;
