import React from 'react';
import { useParams } from 'react-router-dom';
import RecipeDetails from '../components/RecipeDetails';

function DrinksRecipes() {
  const { id } = useParams();
  return (
    <div>
      Drink Recipe id :
      {' '}
      { id }
      <RecipeDetails type="cocktail" />
    </div>
  );
}

export default DrinksRecipes;
