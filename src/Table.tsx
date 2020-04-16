import React from 'react';
import { ITruck } from './interfaces';

function Table({ trucks }: { trucks: ITruck[] }) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Food</th>
            <th>Address</th>
            <th>Type</th>
            <th>Lat/Long</th>
          </tr>
        </thead>
        <tbody>
          {trucks.map(
            ({
              id,
              name,
              latitude,
              longitude,
              address,
              foodTypes,
              vehicleType,
            }) => {
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>
                    {foodTypes.map((foodType) => (
                      <span>{foodType}</span>
                    ))}
                  </td>
                  <td>{address}</td>
                  <td>{vehicleType}</td>
                  <td>
                    {latitude}, {longitude}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </>
  );
}

export default Table;
