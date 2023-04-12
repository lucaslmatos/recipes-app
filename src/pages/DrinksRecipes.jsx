import React from 'react';
import { useParams } from 'react-router-dom';
import RecipeDetails from '../components/RecipeDetails';
import { RecipeType } from '../servers/fetchApi';

function DrinksRecipes() {
  const { id } = useParams();
  return (
    <div>
      Drink Recipe id :
      {' '}
      { id }
      <RecipeDetails type={ RecipeType.DRINK } recommendationType={ RecipeType.MEAL } />
    </div>
  );
}

export default DrinksRecipes;
