import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import fecthApi from '../servers/fetchApi';

function SearchBar() {
  const [recipesType, setRecipesType] = useState('');
  const [inputSearch, setInputSearch] = useState('');
  const location = useLocation();

  const handleTypeRadio = ({ target }) => {
    const { value } = target;
    setRecipesType(
      value,
    );
  };
  const handleInputSearch = ({ target }) => {
    const { value } = target;
    setInputSearch(
      value,
    );
  };
  const handleButtonSearch = () => {
    const drinksOrMeals = location.pathname.includes(
      '/drinks',
    ) ? 'thecocktaildb' : 'themealdb';

    if (recipesType === 'ingredient') {
      fecthApi(`https://www.${drinksOrMeals}.com/api/json/v1/1/filter.php?i=${inputSearch}`);
    }
    if (recipesType === 'name') {
      fecthApi(`https://www.${drinksOrMeals}.com/api/json/v1/1/search.php?s=${inputSearch}`);
    }
    if (recipesType === 'first-letter') {
      if (inputSearch.length > 1) {
        global.alert('Your search must have only 1 (one) character');
        return;
      }
      fecthApi(`https://www.${drinksOrMeals}.com/api/json/v1/1/search.php?f=${inputSearch}`);
    }
  };
  return (
    <div>
      <input
        data-testid="search-input"
        type="text"
        value={ inputSearch }
        onChange={ handleInputSearch }
      />
      <input
        data-testid="ingredient-search-radio"
        type="radio"
        name="recipes_type"
        id="ingredient"
        value="ingredient"
        onChange={ handleTypeRadio }
      />
      <label htmlFor="ingredient">ingredient</label>

      <input
        data-testid="name-search-radio"
        type="radio"
        name="recipes_type"
        id="name"
        value="name"
        onChange={ handleTypeRadio }
      />
      <label htmlFor="name"> name </label>

      <input
        data-testid="first-letter-search-radio"
        type="radio"
        name="recipes_type"
        id="first-letter"
        value="first-letter"
        onChange={ handleTypeRadio }
      />
      <label htmlFor="first-letter"> first letter </label>

      <button
        data-testid="exec-search-btn"
        onClick={ handleButtonSearch }
      >
        Search
      </button>
    </div>
  );
}
export default SearchBar;
