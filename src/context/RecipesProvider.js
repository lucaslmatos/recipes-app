import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import fetchApi from '../servers/fetchApi';
import RecipesContext from './RecipesContext';

function RecipesProvider({ children }) {
  const [listMealsOrDrinks, setListMealsOrDrinks] = useState([]);
  const [category, setCategory] = useState('');
  const location = useLocation();
  const isAtDrinkPage = location.pathname.includes('/drinks');
  const drinksOrMeals = isAtDrinkPage ? 'thecocktaildb' : 'themealdb';
  const drinksOrMealsKeys = isAtDrinkPage ? 'drinks' : 'meals';

  useEffect(() => {
    const getFetchApi = async () => { // fetch para as receitas de comidas
      const endpoint = category ? `filter.php?c=${category}` : 'search.php?s=';
      const response = await fetchApi(`https://www.${drinksOrMeals}.com/api/json/v1/1/${endpoint}`);
      const data = response[drinksOrMealsKeys];
      // seta o estado meals e drinks com todas as receitas de comidas
      setListMealsOrDrinks(
        data,
      );
    };
    getFetchApi();
  }, [drinksOrMeals, drinksOrMealsKeys, category]);

  const value = useMemo(
    () => {
      const handleSetMealsOrDrinks = (list) => {
        if (list === null) {
          global.alert('Sorry, we haven\'t found any recipes for these filters.');
          setListMealsOrDrinks([]);
          return;
        }
        setListMealsOrDrinks(
          list,
        );
      };
      return {
        listMealsOrDrinks,
        handleSetMealsOrDrinks,
        setListMealsOrDrinks,
        setCategory,
      };
    },
    [listMealsOrDrinks, setListMealsOrDrinks, setCategory],
  );

  return (
    <RecipesContext.Provider value={ value }>
      { children }
    </RecipesContext.Provider>
  );
}
RecipesProvider.propTypes = {
  children: PropTypes.shape().isRequired,
};

export default RecipesProvider;
