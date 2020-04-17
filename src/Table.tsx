import React from 'react';
import styled from 'styled-components';
import { ITruck } from './interfaces';
import { FoodTag } from './ui';

const StyledTable = styled.table`
  background: rgb(121, 207, 215);
  position: relative;
  color: hsl(211.4, 37.5%, 12%);
  thead {
    text-align: left;
    position: sticky;
    top: 86px;
    left: 0;
    right: 0;
    color: white;
    background: hsl(211.4, 37.5%, 12%);
  }
`;

function Table({ trucks }: { trucks: ITruck[] }) {
  return (
    <>
      <StyledTable cellSpacing="0" cellPadding="10">
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
            (
              {
                id,
                name,
                latitude,
                longitude,
                address,
                foodTypes,
                vehicleType,
              },
              i
            ) => {
              return (
                <tr
                  key={id}
                  style={{ background: i % 2 ? '' : 'rgba(0, 0, 0, 0.1)' }}
                >
                  <td>{id}</td>
                  <td>
                    <b>{name}</b>
                  </td>
                  <td>
                    {foodTypes.map((foodType, i) => (
                      <FoodTag key={foodType}>{foodType}</FoodTag>
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
      </StyledTable>
    </>
  );
}

export default Table;
