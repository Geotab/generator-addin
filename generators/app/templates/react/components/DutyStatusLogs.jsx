import React, { useState, useEffect, useContext, useMemo } from 'react';
import GeotabContext from '../contexts/Geotab';

import {
  Header,
  SummaryTile,
  IconCloseSquare,
  IconDrive,
  IconWorkday,
  IconOnDuty,
  IconRotateClockwise,
  Table
} from '@geotab/zenith'
import { Overview } from '@geotab/zenith/dist/overview/overview'

const DutyStatusLogs = () => {
  const [context] = useContext(GeotabContext);
  const [dutyStatusLogs, setDutyStatusLogs] = useState([]);
  const [driverRegulation, setDriverRegulation] = useState({});
  const [user, setUser] = useState({ id: '', name: '' })

  const { geotabApi, geotabState, logger } = context;

  useEffect(() => {
    const { currentSession } = geotabState

    console.log('This is the current session: ', currentSession);

    geotabApi.call('Get', {
      typeName: 'User',
      search: {
        name: currentSession.userName
      }
    }, ([user]) => {
      console.log('This is the user ID: ', user.id);
      setUser({ id: user.id, name: user.name })
    }, err => {
      console.error(err)
    })
  }, []);

  useEffect(() => {
    if (!user.id) return

    geotabApi.call('Get', {
      typeName: 'DriverRegulation',
      search: {
        userSearch: {
          id: user.id
        }
      }
    }, ([res]) => {
      console.log('This is the driver regulation result: ', res);
      setDriverRegulation(res)
    }, err => {
      console.error(err);
    })

    geotabApi.call('Get', {
      typeName: 'DutyStatusLog',
      sort: {
        sortBy: 'date',
        sortDirection: 'desc'
      },
      search: {
        userSearch: {
          id: user.id
        }
      },
      resultsLimit: 10
    }, (res) => {
      logger.log(res.map(dutyStatusLog => dutyStatusLog.dateTime))
      setDutyStatusLogs(res)
    }, (err) => {
      logger.error(err)
    })
  }, [user])

  const columns = useMemo(() => [{
    id: "col1",
    title: "Status",
    meta: {
      defaultWidth: 100
    }
  }, {
    id: "col2",
    title: "Date & Time",
    meta: {
      defaultWidth: 100
    }
  }, {
    id: "col3",
    title: "Location",
    meta: {
      defaultWidth: 100
    }
  }, {
    id: "col4",
    title: "Odometer",
    meta: {
      defaultWidth: 100
    }
  }], []);
  const entities = useMemo(() => dutyStatusLogs.map((dutyStatusLog, i) => ({
    id: i.toString(),
    col1: dutyStatusLog.status,
    col2: dutyStatusLog.dateTime,
    col3: dutyStatusLog.location ? dutyStatusLog.location : "No Record",
    col4: dutyStatusLog.odometer ? dutyStatusLog.odometer : "No Record"
  })), [dutyStatusLogs]);

  let availability = driverRegulation?.availability

  const formatCycle = () => {
    if (!availability) return null
    let [days, hours] = availability.cycle.split('.')
    return (parseInt(days) * 24) + parseInt(hours)
  }

  return (
    <div>
      <Header>
        <Header.Title pageName='Duty Status Logs'></Header.Title>
      </Header>
      <div style={{ margin: '25px 0px', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        <SummaryTile title="Current Status">
          <Overview
            icon={<IconCloseSquare className="zen-summary-tile-test" size="huger" />}
            title={driverRegulation?.currentDutyStatus}
          />
        </SummaryTile>
        <SummaryTile title="Cycle">
          <Overview
            icon={<IconRotateClockwise className="zen-summary-tile-test" size="huger" />}
            title={formatCycle()}
          />
        </SummaryTile>
        <SummaryTile title="Driving">
          <Overview
            icon={<IconDrive className="zen-summary-tile-test" size="huger" />}
            title={availability?.driving}
          />
        </SummaryTile>
        <SummaryTile title="Duty">
          <Overview
            icon={<IconOnDuty className="zen-summary-tile-test" size="huger" />}
            title={availability?.duty}
          />
        </SummaryTile>
        <SummaryTile title="Workday">
          <Overview
            icon={<IconWorkday className="zen-summary-tile-test" size="huger" />}
            title={availability?.workday}
          />
        </SummaryTile>
      </div>
      <div style={{ width: "80%", margin: '0 auto' }}>
        <Table height='1000px' description="Duty status logs table." columns={columns} entities={entities || []} expanded={true} options={{}}></Table>
      </div>
    </div >
  );
};

export default DutyStatusLogs;
