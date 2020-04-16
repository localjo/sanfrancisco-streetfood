import React from 'react';
import { ITruck } from './interfaces';

function Map({ trucks }: { trucks: ITruck[] }) {
  return (
    <>
      Map{' '}
      {trucks.map((truck) => {
        return <p key={truck.id}>{truck.name}</p>;
      })}
    </>
  );
}

export default Map;
