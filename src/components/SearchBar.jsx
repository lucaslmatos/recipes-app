import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import RecipesContext from '../context/RecipesContext';
import fetchApi from '../servers/fetchApi';

function SearchBar() {
  const [recipesType, setRecipesType] = useState('');
  const [inputSearch, setInputSearch] = useState('');
  const { listMealsOrDrinks, handleSetMealsOrDrinks } = useContext(RecipesContext);
  const location = useLocation();
  const history = useHistory();
  const isAtDrinkPage = location.pathname.includes('/drinks');
  const drinksOrMeals = isAtDrinkPage ? 'thecocktaildb' : 'themealdb';
  const drinksOrMealsKeys = isAtDrinkPage ? 'drinks' : 'meals';
  const id = isAtDrinkPage ? 'idDrink' : 'idMeal';

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
  const handleButtonSearch = async () => {
    if (recipesType === 'ingredient') {
      const response = await fetchApi(`https://www.${drinksOrMeals}.com/api/json/v1/1/filter.php?i=${inputSearch}`);
      handleSetMealsOrDrinks(
        response[drinksOrMealsKeys],
      );
    }

    if (recipesType === 'name') {
      const response = await fetchApi(`https://www.${drinksOrMeals}.com/api/json/v1/1/search.php?s=${inputSearch}`);
      handleSetMealsOrDrinks(
        response[drinksOrMealsKeys],
      );
    }

    if (recipesType === 'first-letter') {
      if (inputSearch.length > 1) {
        global.alert('Your search must have only 1 (one) character');
        return;
      }
      const response = await fetchApi(`https://www.${drinksOrMeals}.com/api/json/v1/1/search.php?f=${inputSearch}`);
      handleSetMealsOrDrinks(
        response[drinksOrMealsKeys],
      );
    }
  };

  useEffect(() => {
    if (listMealsOrDrinks.length === 1) {
      const idDrinkOrMeals = listMealsOrDrinks[0][id];
      history.push(`/${drinksOrMealsKeys}/${idDrinkOrMeals}`);
    }
  }, [listMealsOrDrinks, isAtDrinkPage, history, drinksOrMealsKeys, id]);

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
