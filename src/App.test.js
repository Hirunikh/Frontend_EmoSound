import { render, screen } from '@testing-library/react';
import App from './App';

test('Test if app rendered', () => {
  render(<App />);
  const linkElement = screen.getByText(/EmoSound: Your Mood, Your Music, Your AI Symphony!/i);
  expect(linkElement).toBeInTheDocument();
});
