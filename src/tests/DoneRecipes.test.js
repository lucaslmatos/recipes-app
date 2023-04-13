import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import renderWithRouter from '../helpers/renderWithRouter';
import DoneRecipe from '../pages/DoneRecipe';

jest.mock('clipboard-copy', () => jest.fn());
const doneRecipes = [
  {
    id: '52771',
    type: 'meal',
    nationality: 'Italian',
    category: 'Vegetarian',
    alcoholicOrNot: '',
    name: 'Spicy Arrabiata Penne',
    image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
    doneDate: '23/06/2020',
    tags: ['Pasta', 'Curry'],
  },
  {
    id: '178319',
    type: 'drink',
    nationality: '',
    category: 'Cocktail',
    alcoholicOrNot: 'Alcoholic',
    name: 'Aquamarine',
    image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
    doneDate: '23/06/2020',
    tags: [],
  },
];

const recipeNameMeal = 'Spicy Arrabiata Penne';
const location = '/done-recipes';
describe('Teste do componente <DoneRecipe />', () => {
  test('Testa se os botões "All", "Meals" e "Drinks" aparecem na tela', () => {
    renderWithRouter(<DoneRecipe />);
    const buttonAll = screen.getByTestId('filter-by-all-btn');
    expect(buttonAll).toBeInTheDocument();

    const buttonMeals = screen.getByTestId('filter-by-meal-btn');
    expect(buttonMeals).toBeInTheDocument();

    const buttonDrinks = screen.getByTestId('filter-by-drink-btn');
    expect(buttonDrinks).toBeInTheDocument();
  });
  test('Testa se ao clicar nos botão "Meals" a lista de receitas são filtradas', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    renderWithRouter(
      <App />,
      [location],
    );
    const buttonMeals = screen.getByTestId('filter-by-meal-btn');
    userEvent.click(buttonMeals);

    const nameMeal = await screen.findByText(recipeNameMeal);
    expect(nameMeal).toBeInTheDocument();

    const nameDrink = screen.queryByText('Aquamarine');
    expect(nameDrink).not.toBeInTheDocument();
  });
  test('Testa se ao clicar nos botão "Drinks" a lista de receitas são filtradas', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    renderWithRouter(
      <App />,
      [location],
    );
    const buttonDrinks = screen.getByTestId('filter-by-drink-btn');
    userEvent.click(buttonDrinks);

    const nameDrink = await screen.findByText('Aquamarine');
    expect(nameDrink).toBeInTheDocument();

    const nameMeal = screen.queryByText(recipeNameMeal);
    expect(nameMeal).not.toBeInTheDocument();
  });
  test('Testa se ao clicar nos botão "All" a lista de drinks e meals aparecem', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    renderWithRouter(
      <App />,
      [location],
    );
    const buttonAll = screen.getByTestId('filter-by-all-btn');
    userEvent.click(buttonAll);

    const nameMeal = await screen.findByText(recipeNameMeal);
    expect(nameMeal).toBeInTheDocument();

    const nameDrink = await screen.findByText('Aquamarine');
    expect(nameDrink).toBeInTheDocument();
  });
  test('Testa se ao clicar na imagem ocorre redirecionamento para pagina de detalhes', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    const { history } = renderWithRouter(
      <App />,
      [location],
    );
    const imageMeals = screen.getByTestId('0-horizontal-image');
    expect(imageMeals).toBeInTheDocument();

    userEvent.click(imageMeals);
    await waitFor(() => {
      expect(history.location.pathname).toEqual('/meals/52771');
    });
  });
  test('Testa se ao clicar no name ocorre redirecionamento para pagina de detalhes', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    const { history } = renderWithRouter(
      <App />,
      [location],
    );
    const nameMeals = screen.getByTestId('0-horizontal-name');
    expect(nameMeals).toBeInTheDocument();

    userEvent.click(nameMeals);
    await waitFor(() => {
      expect(history.location.pathname).toEqual('/meals/52771');
    });
  });
  test('Click no botão de compartilhar', async () => {
    renderWithRouter(<DoneRecipe />);

    const button = screen.getByTestId('0-horizontal-share-btn');
    expect(button).toBeInTheDocument();

    userEvent.click(button);

    const textCopied = await screen.findByText('Link copied!');
    expect(textCopied).toBeInTheDocument();
  });
});
