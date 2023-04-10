import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import fetchApi from '../servers/fetchApi';
import CategoriesContext from './CategoriesContext';

function CategoriesProvider({ children }) {
  const [mealsCategories, setMealsCategories] = useState([]); // estado que armazena todas as categorias de comidas
  const [drinksCategories, setDrinksCategories] = useState([]); // estado que armazena todas as categorias de bebidas

  const contextCATEGORIES = useMemo(() => ({
    mealsCategories,
    setMealsCategories,
    drinksCategories,
    setDrinksCategories,
  }), [mealsCategories, drinksCategories]);

  const fetchMealsCategories = async () => {
    try {
      const { meals } = await fetchApi('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
      setMealsCategories(meals);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchDrinksCategories = async () => {
    try {
      const { drinks } = await fetchApi('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
      setDrinksCategories(drinks);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => { // fetch para as categorias de comidas
    fetchMealsCategories();
    fetchDrinksCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={ contextCATEGORIES }>
      {children}
    </CategoriesContext.Provider>
  );
}

CategoriesProvider.propTypes = {
  children: PropTypes.element,
}.isRequired;

export default CategoriesProvider;
