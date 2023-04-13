import React, { useState } from 'react';
import DoneDrinks from './DoneDrinks';
import DoneMeals from './DoneMeals';
import Header from './Header';

function DoneRecipes() {
  const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes') || '[]');
  const [newFiltered, setNewFiltered] = useState(doneRecipes);

  const handleFilterType = (type) => {
    setNewFiltered(
      doneRecipes.filter((recipe) => {
        if (type === 'all') {
          return true;
        }
        return recipe.type === type;
      }),
    );
  };

  return (
    <div>
      <Header title=" Done Recipes" hasSearchIcon={ false } />
      <button
        type="button"
        onClick={ () => { handleFilterType('meal'); } }
        data-testid="filter-by-meal-btn"
      >
        Meals
      </button>
      <button
        type="button"
        onClick={ () => { handleFilterType('drink'); } }
        data-testid="filter-by-drink-btn"
      >
        Drinks
      </button>
      <button
        type="button"
        onClick={ () => { handleFilterType('all'); } }
        data-testid="filter-by-all-btn"
      >
        All
      </button>

      {newFiltered.map((recipe, index) => {
        if (recipe.type === 'meal') {
          return (<DoneMeals
            key={ recipe.id }
            image={ recipe.image }
            id={ recipe.id }
            name={ recipe.name }
            both={ `${recipe.nationality} - ${recipe.category}` }
            doneDate={ recipe.doneDate }
            tags={ recipe.tags }
            index={ index }
          />);
        }
        return (<DoneDrinks
          key={ recipe.id }
          id={ recipe.id }
          image={ recipe.image }
          name={ recipe.name }
          alcoholicOrNot={ recipe.alcoholicOrNot }
          doneDate={ recipe.doneDate }
          index={ index }
        />);
      })}
    </div>
  );
}

export default DoneRecipes;
