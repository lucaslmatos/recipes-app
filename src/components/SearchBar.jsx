import React, { useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import RecipesContext from '../context/RecipesContext';
import fetchApi from '../servers/fetchApi';

function SearchBar() {
  const [recipesType, setRecipesType] = useState('');
  const [inputSearch, setInputSearch] = useState('');
  const { handleSetMealsOrDrinks } = useContext(RecipesContext);
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
  const fetchResults = async () => { // um fetch para cada tipo de busca
    if (recipesType === 'ingredient') {
      return fetchApi(`https://www.${drinksOrMeals}.com/api/json/v1/1/filter.php?i=${inputSearch}`);
    }

    if (recipesType === 'name') {
      return fetchApi(`https://www.${drinksOrMeals}.com/api/json/v1/1/search.php?s=${inputSearch}`);
    }

    if (recipesType === 'first-letter') {
      return fetchApi(`https://www.${drinksOrMeals}.com/api/json/v1/1/search.php?f=${inputSearch}`);
    }
  };

  const handleButtonSearch = async () => {
    if (recipesType === 'first-letter' && inputSearch.length !== 1) { // se for busca por letra, só pode ter 1 caracter
      global.alert('Your search must have only 1 (one) character');
      return;
    }

    const response = await fetchResults();
    const results = response[drinksOrMealsKeys]; // resultados do fetch

    handleSetMealsOrDrinks(results); // seta o estado com os resultados da busca

    if (results?.length === 1) { // se tiver apenas 1 resultado, redireciona para a página de detalhes
      history.push(`/${drinksOrMealsKeys}/${results[0][id]}`); // redireciona para a página de detalhes
    }
  };

  // useEffect(() => {
  //   if (listMealsOrDrinks.length === 1) {
  //     const idDrinkOrMeals = listMealsOrDrinks[0][id];
  //     history.push(`/${drinksOrMealsKeys}/${idDrinkOrMeals}`);
  //   }
  // }, [listMealsOrDrinks, isAtDrinkPage, history, drinksOrMealsKeys, id]);

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
