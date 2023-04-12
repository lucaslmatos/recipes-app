import React from 'react';
import RecipeInProgress from '../components/RecipeInProgress';
import { RecipeType } from '../servers/fetchApi';

function DrinksProgress() {
  return (
    <div>
      <RecipeInProgress type={ RecipeType.DRINK } />
    </div>
  );
}

export default DrinksProgress;
