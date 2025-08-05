import { render, screen, fireEvent } from '@testing-library/react-native';
import App from '../../mobile/App';

test('renders login button', () => {
  render(<App />);
  const loginButton = screen.getByText(/Login/i);
  expect(loginButton).toBeInTheDocument();
});