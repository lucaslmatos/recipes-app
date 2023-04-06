import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import chickenMeals from '../../cypress/mocks/chickenMeals';
import drinkCategories from '../../cypress/mocks/drinkCategories';
import drinks from '../../cypress/mocks/drinks';
import mealCategories from '../../cypress/mocks/mealCategories';
import meals from '../../cypress/mocks/meals';
import oneMeal from '../../cypress/mocks/oneMeal';
import App from '../App';
import SearchBar from '../components/SearchBar';
import CategoriesProvider from '../context/CategoriesProvider';
import RecipesProvider from '../context/RecipesProvider';
import fetchApi from '../servers/fetchApi';
import renderWithRouter from './helpers/renderWithRouter';

jest.mock('../servers/fetchApi');

describe('Testes: Search', () => {
  const searchInputTextId = 'search-input';
  const firstLetter = 'first-letter-search-radio';
  const ingredientSearch = 'ingredient-search-radio';
  const buttonSearch = 'exec-search-btn';
  const nameSearch = 'name-search-radio';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Input do tipo text e radio exibidos na tela', () => {
    renderWithRouter(
      <RecipesProvider>
        <SearchBar />
      </RecipesProvider>,
    );
    const searchInput = screen.getByTestId(searchInputTextId);
    expect(searchInput).toBeInTheDocument();
    expect(screen.getByTestId(ingredientSearch)).toBeInTheDocument();
    expect(screen.getByTestId(nameSearch)).toBeInTheDocument();
    expect(screen.getByTestId(firstLetter)).toBeInTheDocument();
  });
  test('Teste com input text e tipo radio "ingredient"', () => {
    renderWithRouter(
      <RecipesProvider>
        <SearchBar />
      </RecipesProvider>,
    );
    const searchInput = screen.getByTestId(searchInputTextId);
    userEvent.type(searchInput, 'chicken');

    const ingredient = screen.getByTestId(ingredientSearch);
    userEvent.click(ingredient);

    const button = screen.getByTestId(buttonSearch);
    userEvent.click(button);
  });
  test('Teste input radio "first-letter" com alert', () => {
    renderWithRouter(
      <RecipesProvider>
        <SearchBar />
      </RecipesProvider>,
    );
    global.alert = jest.fn();
    const searchInput = screen.getByTestId(searchInputTextId);
    userEvent.type(searchInput, 'oo');

    const firstLetterSearch = screen.getByTestId(firstLetter);
    userEvent.click(firstLetterSearch);

    const button = screen.getByTestId(buttonSearch);
    userEvent.click(button);
    expect(global.alert).toHaveBeenCalledTimes(1);
  });
  test('Teste chamada API meals com input radio first letter', async () => {
    fetchApi.mockResolvedValueOnce(chickenMeals);
    global.fetch = jest.fn(async () => ({
      json: async () => chickenMeals,
    }));
    await act(async () => {
      renderWithRouter(
        <RecipesProvider>
          <SearchBar />
        </RecipesProvider>,
      );
    });

    const inputText = screen.getByTestId(searchInputTextId);
    userEvent.type(inputText, 'c');

    const firstLetterSearch = screen.getByTestId('first-letter-search-radio');
    userEvent.click(firstLetterSearch);

    const button = screen.getByTestId('exec-search-btn');
    userEvent.click(button);

    expect(global.fetch).toHaveBeenCalled();
  });
  test('Teste chamada API meals com input radio name', async () => {
    fetchApi.mockResolvedValueOnce(chickenMeals);
    global.fetch = jest.fn(async () => ({
      json: async () => chickenMeals,
    }));
    await act(async () => {
      renderWithRouter(
        <RecipesProvider>
          <SearchBar />
        </RecipesProvider>,
      );
    });

    const inputText = screen.getByTestId(searchInputTextId);
    userEvent.type(inputText, 'chicken');

    const name = screen.getByTestId(nameSearch);
    userEvent.click(name);

    const button = screen.getByTestId(buttonSearch);
    userEvent.click(button);

    expect(global.fetch).toHaveBeenCalled();
  });
  test('Se tiver apenas um meals ocorre o redirecionamento para outra página', async () => {
    fetchApi.mockResolvedValueOnce(meals);
    global.fetch = jest.fn().mockImplementationOnce({
      json: async () => mealCategories,
    });
    global.fetch = jest.fn().mockImplementationOnce({
      json: async () => drinkCategories,
    });
    const { history } = renderWithRouter(
      <RecipesProvider>
        <CategoriesProvider>
          <App />
        </CategoriesProvider>
      </RecipesProvider>,
      ['/meals'],
    );

    const buttonSearch1 = screen.getByTestId('search-top-btn');
    userEvent.click(buttonSearch1);

    const inputText = screen.getByTestId(searchInputTextId);
    userEvent.type(inputText, 'Spicy Arrabiata Penne');

    const name = screen.getByTestId(nameSearch);
    userEvent.click(name);

    const button = screen.getByTestId(buttonSearch);
    userEvent.click(button);

    fetchApi.mockResolvedValueOnce(oneMeal);
    expect(fetchApi).toHaveBeenCalledTimes(2);

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/meals/52771');
    });
  });
  test('Se tiver apenas um drink ocorre o redirecionamento para outra página', async () => {
    fetchApi.mockResolvedValueOnce(drinks);
    global.fetch = jest.fn().mockImplementationOnce({
      json: async () => mealCategories,
    });
    global.fetch = jest.fn().mockImplementationOnce({
      json: async () => drinkCategories,
    });
    const { history } = renderWithRouter(
      <RecipesProvider>
        <CategoriesProvider>
          <App />
        </CategoriesProvider>
      </RecipesProvider>,
      ['/drinks'],
    );
    const buttonSearch2 = screen.getByTestId('search-top-btn');
    userEvent.click(buttonSearch2);

    const inputText = screen.getByTestId(searchInputTextId);
    userEvent.type(inputText, 'Aquamarine');

    const name = screen.getByTestId(nameSearch);
    userEvent.click(name);

    const button = screen.getByTestId(buttonSearch);
    userEvent.click(button);

    expect(global.fetch).toHaveBeenCalled();

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/drinks/178319');
    });
  });
});
