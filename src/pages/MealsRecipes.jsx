import React from 'react';
import { useParams } from 'react-router-dom';
import RecipeDetails from '../components/RecipeDetails';

function MealsRecipes() {
  const { id } = useParams();
  return (
    <div>
      Meal Recipe id :
      {' '}
      { id }
      <RecipeDetails type="meal" />
    </div>
  );
}

export default MealsRecipes;
