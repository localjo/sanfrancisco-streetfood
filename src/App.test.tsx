import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders San Francisco Street Food heading', () => {
  const { getByText } = render(<App />);
  const heading = getByText(/San Francisco Street Food/i);
  expect(heading).toBeInTheDocument();
});
