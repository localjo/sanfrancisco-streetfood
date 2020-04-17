import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { StatusIndicator } from './ui';
import Map from './Map';
import Table from './Table';
import { NetworkStatus, ITruck } from './interfaces';
import { getTrucks } from './truckapi';
import { ReactComponent as MapIcon } from './icons/map.svg';
import { ReactComponent as TableIcon } from './icons/table.svg';
import { ReactComponent as FoodIcon } from './icons/food.svg';

const Wrapper = styled.div`
  margin: 0 auto;
  position: relative;
`;
const Header = styled.div`
  position: fixed;
  height: 85px;
  left: 0;
  top: 0;
  right: 0;
  z-index: 100;
  background: hsl(211.4, 37.5%, 22%);
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid hsl(211.4, 37.5%, 12%);
  h1 {
    line-height: 35px;
    color: white;
    font-family: 'Yesteryear', sans-serif;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    font-size: 35px;
    letter-spacing: 1px;
    float: left;
    position: relative;
    bottom: 9px;
    svg {
      position: relative;
      top: 7px;
      fill: white;
      margin: 0 20px;
    }
  }
  div {
    float: right;
    padding: 26px;
  }
`;
const Button = styled.button`
  appearance: none;
  background: none;
  border: none;
  height: 35px;
  svg {
    fill: ${(props) => (props.disabled ? 'rgba(255,255,255,0.5)' : 'white')};
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  }
`;
const Main = styled.div`
  margin-top: 85px;
  height: calc(100vh - 85px);
`;
const Footer = styled.small`
  position: fixed;
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
          <FoodIcon width="50" height="40" />
          San Francisco Street Food
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
      <Main>
        {isLoading ? (
          <StatusIndicator>
            <p>Loading...</p>
          </StatusIndicator>
        ) : isError ? (
          <StatusIndicator>
            <p>Network Error</p>
          </StatusIndicator>
        ) : isComplete ? (
          tab === 'map' ? (
            <Map trucks={trucks} />
          ) : (
            <Table trucks={trucks} />
          )
        ) : (
          <StatusIndicator>
            <p>No Data</p>
          </StatusIndicator>
        )}
      </Main>
      <Footer style={tab === 'table' ? { bottom: 0 } : {}}>
        Source: <a href={sourceUrl}>DataSF</a>
      </Footer>
    </Wrapper>
  );
}

export default App;
