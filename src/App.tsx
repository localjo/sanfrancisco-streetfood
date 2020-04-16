import React, { useState, useEffect } from 'react';
import Map from './Map';
import Table from './Table';
import { NetworkStatus, ITruck } from './interfaces';
import { getTrucks } from './truckapi';

function App() {
  const [tab, setTab] = useState('map');
  const [trucks, setTrucks] = useState<ITruck[]>([]);
  const [status, setStatus] = useState<NetworkStatus>(NetworkStatus.EMPTY);
  const isLoading = status === NetworkStatus.LOADING;
  const isComplete = status === NetworkStatus.COMPLETE && trucks.length > 0;
  const isError = status === NetworkStatus.ERROR;

  useEffect(() => {
    if (status === NetworkStatus.EMPTY) {
      setStatus(NetworkStatus.LOADING);
      getTrucks()
        .then((trucks) => {
          setStatus(NetworkStatus.COMPLETE);
          setTrucks(trucks);
        })
        .catch(() => {
          setStatus(NetworkStatus.ERROR);
        });
    }
  }, [status]);

  return (
    <>
      <button disabled={tab === 'map'} onClick={() => setTab('map')}>
        Map
      </button>
      <button disabled={tab === 'table'} onClick={() => setTab('table')}>
        Table
      </button>
      <br />
      {isLoading ? (
        'Loading...'
      ) : isError ? (
        'Network error'
      ) : isComplete ? (
        tab === 'map' ? (
          <Map trucks={trucks} />
        ) : (
          <Table />
        )
      ) : (
        'No data'
      )}
    </>
  );
}

export default App;
