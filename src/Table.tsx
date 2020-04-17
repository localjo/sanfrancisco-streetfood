import React from 'react';
import styled from 'styled-components';
import { ITruck } from './interfaces';

const StyledTable = styled.table`
  margin-top: 85px;
  background: rgba(50, 50, 50);
  position: relative;
  thead {
    text-align: 'left';
    position: sticky;
    top: 86px;
    left: 0;
    right: 0;
    background: rgb(0, 0, 0);
  }
`;
const FoodTag = styled.span`
  background: rgba(0, 0, 0, 0.3);
  padding: 3px;
  margin: 2px;
  display: inline-block;
  border-radius: 3px;
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
                  style={{ background: i % 2 ? '' : 'rgba(255, 255,255, 0.1)' }}
                >
                  <td>{id}</td>
                  <td>{name}</td>
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
