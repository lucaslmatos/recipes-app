import React from 'react';
import RecipeInProgress from '../components/RecipeInProgress';
import { RecipeType } from '../servers/fetchApi';

function MealsProgress() {
  return (
    <div>
      <RecipeInProgress type={ RecipeType.MEAL } />
    </div>
  );
}

export default MealsProgress;
