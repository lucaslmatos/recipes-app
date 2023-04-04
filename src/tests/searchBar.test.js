import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar';
import renderWithRouter from './helpers/renderWithRouter';

describe('Testes: Search', () => {
  const searchInputTextId = 'search-input';
  test('Input do tipo text e radio exibidos na tela', () => {
    renderWithRouter(<SearchBar />);
    const searchInput = screen.getByTestId(searchInputTextId);
    expect(searchInput).toBeInTheDocument();
    expect(screen.getByTestId('ingredient-search-radio')).toBeInTheDocument();
    expect(screen.getByTestId('name-search-radio')).toBeInTheDocument();
    expect(screen.getByTestId('first-letter-search-radio')).toBeInTheDocument();
  });
  test('Teste com input text e tipo radio "ingredient"', () => {
    renderWithRouter(<SearchBar />);
    const searchInput = screen.getByTestId(searchInputTextId);
    userEvent.type(searchInput, 'chicken');

    const ingredientSearch = screen.getByTestId('ingredient-search-radio');
    userEvent.click(ingredientSearch);

    const buttonSearch = screen.getByTestId('exec-search-btn');
    userEvent.click(buttonSearch);
  });
  test('Teste input radio "first-letter" com alert', () => {
    renderWithRouter(<SearchBar />);
    global.alert = jest.fn();
    const searchInput = screen.getByTestId(searchInputTextId);
    userEvent.type(searchInput, 'oo');

    const ingredientSearch = screen.getByTestId('first-letter-search-radio');
    userEvent.click(ingredientSearch);

    const buttonSearch = screen.getByTestId('exec-search-btn');
    userEvent.click(buttonSearch);
    expect(global.alert).toHaveBeenCalledTimes(1);
  });
});
