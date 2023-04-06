import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import Recipes from '../components/Recipes';
// import CategoriesContext from '../context/CategoriesContext';
// import RecipesContext from '../context/RecipesContext';
import renderWithRouter from './helpers/renderWithRouter';
import Categories from '../components/Categories';
import RecipesProvider from '../context/RecipesProvider';
import CategoriesProvider from '../context/CategoriesProvider';

describe('Testa o componente <Recipes />', () => {
  const recipes = [
    {
      idMeal: '52977',
      strMeal: 'Corba',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
    },
    {
      idMeal: '53060',
      strMeal: 'Burek',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
    },
  ];

  const mealsCategories = ['Beef', 'Chicken', 'Breakfast', 'Goat', 'Dessert'];
  const drinksCategories = ['Ordinary Drink', 'Cocktail', 'Milk / Float / Shake', 'Other/Unknown', 'Cocoa'];
  const recipeDrinks = [
    {
      idDrink: '15997',
      strDrink: 'GG',
      strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg',
    },
    {
      idDrink: '17222',
      strDrink: 'A1',
      strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/2x8thr1504816928.jpg',
    },
  ];
  it('Testa se o componente é renderizado corretamente com as categorias corretas', () => {
    renderWithRouter(
      <CategoriesProvider>
        <RecipesProvider>
          <Recipes type="meal" recipes={ [] } />
        </RecipesProvider>
      </CategoriesProvider>,
    );
    const categoryBeef = screen.getByText('Beef');
    const categoryChicken = screen.getByText('Chicken');
    const categoryBreakfast = screen.getByText('Breakfast');
    const categoryGoat = screen.getByText('Goat');
    const categoryDessert = screen.getByText('Dessert');
    expect(categoryBeef).toBeInTheDocument();
    expect(categoryChicken).toBeInTheDocument();
    expect(categoryBreakfast).toBeInTheDocument();
    expect(categoryGoat).toBeInTheDocument();
    expect(categoryDessert).toBeInTheDocument();
  });
  it('Testa se o redirecionamento ocorre corretamente ao clicar nas receitas', () => {
    // Função de mock para o redirecionamento
    const mockHistoryPush = jest.fn();
    renderWithRouter(
      <CategoriesProvider>
        <RecipesProvider>
          <Categories categories={ mealsCategories } />
          <Recipes type="meal" recipes={ recipes } />
        </RecipesProvider>
      </CategoriesProvider>,
    );

    const renderedRecipes = screen.getByTestId('0-recipe-card');
    const renderedRecipesName = screen.getByTestId('0-recipe-title');
    const renderedRecipesImage = screen.getByTestId('0-recipe-card-img');

    // Simule o clique no primeiro card de receita
    fireEvent.click(renderedRecipes);

    // Verifique se a função history.push foi chamada com a rota correta
    expect(mockHistoryPush).toHaveBeenCalledWith('/meals/52977');
    expect(renderedRecipesName).toBeInTheDocument();
    expect(renderedRecipesImage).toBeInTheDocument();
  });
  it('Testa para o type "drink" se o componente é renderizado corretamente com as categorias corretas', () => {
    const mockHistoryPush = jest.fn();

    renderWithRouter(
      <CategoriesProvider>
        <RecipesProvider>
          <Categories categories={ drinksCategories } />
          <Recipes type="drink" recipes={ recipeDrinks } />
        </RecipesProvider>
      </CategoriesProvider>,
    );

    const categoryOrdinaryDrink = screen.getByText('Ordinary Drink');
    const categoryCocktail = screen.getByText('Cocktail');
    const categoryMilk = screen.getByText('Milk / Float / Shake');
    const categoryOther = screen.getByText('Other/Unknown');
    const categoryCocoa = screen.getByText('Cocoa');
    const firstDrink = screen.getByTestId('0-recipe-card');
    expect(categoryOrdinaryDrink).toBeInTheDocument();
    expect(categoryCocktail).toBeInTheDocument();
    expect(categoryMilk).toBeInTheDocument();
    expect(categoryOther).toBeInTheDocument();
    expect(categoryCocoa).toBeInTheDocument();
    fireEvent.click(firstDrink);
    expect(mockHistoryPush).toHaveBeenCalledWith('/drinks/15997');
  });
});
