import styled from 'styled-components';

export const FoodTag = styled.span`
  background: hsl(211.4, 37.5%, 12%);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 5px;
  margin: 2px;
  display: inline-block;
  border-radius: 3px;
  text-transform: uppercase;
`;

export const StatusIndicator = styled.div`
  text-align: center;
  height: 100%;
  width: 100%;
  color: rgba(0, 0, 0, 0.5);
  display: table;
  * {
    display: table-cell;
    vertical-align: middle;
  }
`;
