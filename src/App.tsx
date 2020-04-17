import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Map from './Map';
import Table from './Table';
import { NetworkStatus, ITruck } from './interfaces';
import { getTrucks } from './truckapi';
import { ReactComponent as MapIcon } from './icons/map.svg';
import { ReactComponent as TableIcon } from './icons/table.svg';
import { ReactComponent as FoodIcon } from './icons/food.svg';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;
const Header = styled.div`
  clear: both;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  max-width: 1200px;
  margin: 0 auto;
  h1 {
    color: #0a84ff;
    text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.7);
    font-family: 'Bangers', sans-serif;
    font-size: 35px;
    letter-spacing: 1px;
    float: left;
    svg {
      fill: #0a84ff;
    }
  }
  div {
    float: right;
    padding: 25px;
  }
`;
const Button = styled.button`
  appearance: none;
  background: none;
  border: none;
  height: 35px;
  svg {
    fill: ${(props) => (props.disabled ? 'gray' : 'white')};
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  }
`;
const Footer = styled.small`
  position: absolute;
  bottom: 20px;
  right: 0;
  color: #282828;
  z-index: 100;
  padding: 2px 10px;
  background: rgba(255, 255, 255, 0.5);
  text-align: right;
  font-size: 12px;
  a {
    color: #282828 !important;
    font-weight: bold;
    text-decoration: none;
    &:hover {
      color: black !important;
      text-decoration: underline;
    }
  }
`;
const sourceUrl =
  'https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat';

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
    <Wrapper>
      <Header>
        <h1>
          <FoodIcon width="50" height="30" />
          San Francisco Street Food Map
        </h1>
        <div>
          <Button disabled={tab === 'map'} onClick={() => setTab('map')}>
            <MapIcon width="40" />
          </Button>
          <Button disabled={tab === 'table'} onClick={() => setTab('table')}>
            <TableIcon width="40" />
          </Button>
        </div>
      </Header>
      {isLoading ? (
        'Loading...'
      ) : isError ? (
        'Network error'
      ) : isComplete ? (
        tab === 'map' ? (
          <Map trucks={trucks} />
        ) : (
          <Table trucks={trucks} />
        )
      ) : (
        'No data'
      )}
      <Footer>
        Source: <a href={sourceUrl}>DataSF</a>
      </Footer>
    </Wrapper>
  );
}

export default App;
