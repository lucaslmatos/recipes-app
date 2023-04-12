import React from 'react';
import { useParams } from 'react-router-dom';
import RecipeDetails from '../components/RecipeDetails';
import { RecipeType } from '../servers/fetchApi';

function MealsRecipes() {
  const { id } = useParams();
  return (
    <div>
      Meal Recipe id :
      {' '}
      { id }
      <RecipeDetails type={ RecipeType.MEAL } recommendationType={ RecipeType.DRINK } />
    </div>
  );
}

export default MealsRecipes;
