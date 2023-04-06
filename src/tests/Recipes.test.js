import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Recipes from '../components/Recipes';
import CategoriesContext from '../context/CategoriesContext';
// import renderWithRouter from './helpers/renderWithRouter';

describe('Testa o componente <Recipes />', () => {
  it('Testa se o componente é renderizado corretamente com as categorias corretas', () => {
    const mealsCategories = ['Beef', 'Chicken', 'Breakfast', 'Goat', 'Dessert'];
    const drinksCategories = ['Cocktail', 'Ordinary Drink', 'Shake', 'Other/Unknown', 'Cocoa'];
    render(
      <CategoriesContext.Provider value={ { mealsCategories, drinksCategories } }>
        <Recipes type="meal" recipes={ [] } />
      </CategoriesContext.Provider>,
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

    // Função de mock para o redirecionamento
    const mockHistoryPush = jest.fn();
    render(
      <Router>
        <CategoriesContext.Provider
          value={ { mealsCategories: [], drinksCategories: [] } }
        >
          <Recipes type="meal" recipes={ recipes } />
        </CategoriesContext.Provider>
      </Router>,
    );

    const renderedRecipes = screen.getAllByTestId('recipe-card');

    // Simule o clique no primeiro card de receita
    fireEvent.click(renderedRecipes[0]);

    // Verifique se a função history.push foi chamada com a rota correta
    expect(mockHistoryPush).toHaveBeenCalledWith('/meals/52977');
  });
});
