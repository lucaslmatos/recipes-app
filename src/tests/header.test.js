import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';

describe('Testes: Header', () => {
  test('Imagens de pesquisar e profile exibidas no Header', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('page-title')).toBeInTheDocument();
    expect(screen.getByTestId('profile-top-btn')).toBeInTheDocument();
    expect(screen.getByTestId('search-top-btn')).toBeInTheDocument();
  });
  test('Se ao clicar no botão search aparece um input', () => {
    const buttonSearch = screen.getByTestId('search-top-btn');
    userEvent.click(buttonSearch);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });
});
