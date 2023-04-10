import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import chickenMeals from '../../cypress/mocks/chickenMeals';
import cocktailDrinks from '../../cypress/mocks/cocktailDrinks';
import cocoaDrinks from '../../cypress/mocks/cocoaDrinks';
import drinkCategories from '../../cypress/mocks/drinkCategories';
import mealCategories from '../../cypress/mocks/mealCategories';
import oneDrink from '../../cypress/mocks/oneDrink';
import oneMeal from '../../cypress/mocks/oneMeal';
import App from '../App';
import CategoriesProvider from '../context/CategoriesProvider';
import RecipesProvider from '../context/RecipesProvider';
import fetchApi from '../servers/fetchApi';
import renderWithRouter from './helpers/renderWithRouter';

jest.mock('../servers/fetchApi');

describe('Testa o componente <Recipes />', () => {
  it('Testa se o componente é renderizado corretamente com as categorias corretas', async () => {
    fetchApi.mockResolvedValueOnce(mealCategories);
    fetchApi.mockResolvedValueOnce(drinkCategories);
    fetchApi.mockResolvedValueOnce(chickenMeals);

    renderWithRouter(
      <RecipesProvider>
        <CategoriesProvider>
          <App />
        </CategoriesProvider>
      </RecipesProvider>,
      ['/meals'],
    );

    const categoryBeef = await screen.findByText('Beef');
    const categoryChicken = await screen.findByText('Chicken');
    const categoryBreakfast = await screen.findByText('Breakfast');
    const categoryGoat = await screen.findByText('Goat');
    const categoryDessert = await screen.findByText('Dessert');
    expect(categoryBeef).toBeInTheDocument();
    expect(categoryChicken).toBeInTheDocument();
    expect(categoryBreakfast).toBeInTheDocument();
    expect(categoryGoat).toBeInTheDocument();
    expect(categoryDessert).toBeInTheDocument();
  });
  it('Testa se o redirecionamento ocorre corretamente ao clicar nas receitas', async () => {
    fetchApi.mockResolvedValueOnce(mealCategories);
    fetchApi.mockResolvedValueOnce(drinkCategories);
    fetchApi.mockResolvedValueOnce(chickenMeals);
    fetchApi.mockResolvedValueOnce(oneMeal);

    const { history } = renderWithRouter(
      <RecipesProvider>
        <CategoriesProvider>
          <App />
        </CategoriesProvider>
      </RecipesProvider>,
      ['/meals'],
    );

    const renderedRecipes = await screen.findByTestId('0-recipe-card');

    // Simule o clique no primeiro card de receita
    userEvent.click(renderedRecipes);

    // Verifique se a função history.push foi chamada com a rota correta
    await waitFor(() => {
      expect(history.location.pathname).toEqual('/meals/52940');
    });
  });
  it('Testa para o type "drink" se o componente é renderizado corretamente com as categorias corretas', async () => {
    fetchApi.mockResolvedValueOnce(mealCategories);
    fetchApi.mockResolvedValueOnce(drinkCategories);
    fetchApi.mockResolvedValueOnce(cocktailDrinks);
    fetchApi.mockResolvedValueOnce(oneDrink);

    const { history } = renderWithRouter(
      <RecipesProvider>
        <CategoriesProvider>
          <App />
        </CategoriesProvider>
      </RecipesProvider>,
      ['/drinks'],
    );

    const categoryOrdinaryDrink = await screen.findByText('Ordinary Drink');
    const categoryCocktail = await screen.findByText('Cocktail');
    const categoryShake = await screen.findByText('Shake');
    const categoryOther = await screen.findByText('Other/Unknown');
    const categoryCocoa = await screen.findByText('Cocoa');
    const firstDrink = screen.getByTestId('0-recipe-card');
    expect(categoryOrdinaryDrink).toBeInTheDocument();
    expect(categoryCocktail).toBeInTheDocument();
    expect(categoryShake).toBeInTheDocument();
    expect(categoryOther).toBeInTheDocument();
    expect(categoryCocoa).toBeInTheDocument();
    userEvent.click(firstDrink);

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/drinks/14029');
    });
  });
  it('Testa o clique em uma categoria e sua renderização', async () => {
    fetchApi.mockResolvedValueOnce(mealCategories);
    fetchApi.mockResolvedValueOnce(drinkCategories);
    fetchApi.mockResolvedValueOnce(cocktailDrinks);
    fetchApi.mockResolvedValueOnce(cocoaDrinks);
    fetchApi.mockResolvedValueOnce(cocktailDrinks);
    fetchApi.mockResolvedValueOnce(cocktailDrinks);

    renderWithRouter(
      <RecipesProvider>
        <CategoriesProvider>
          <App />
        </CategoriesProvider>
      </RecipesProvider>,
      ['/drinks'],
    );

    const categoryCocoa = await screen.findByText('Cocoa');
    userEvent.click(categoryCocoa);
    const firstCocoaDrink = await screen.findByText('Castillian Hot Chocolate');
    expect(firstCocoaDrink).toBeInTheDocument();
    userEvent.click(categoryCocoa);

    const categoryAll = await screen.findByText('All');
    userEvent.click(categoryAll);
  });
});
