import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

describe('App component', () => {
  test('renders navigation items', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });
});