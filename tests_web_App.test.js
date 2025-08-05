import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../web/src/App';

test('renders login button', () => {
  render(<App />);
  const loginButton = screen.getByText(/Login/i);
  expect(loginButton).toBeInTheDocument();
});