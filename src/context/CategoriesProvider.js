import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
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

  useEffect(() => { // fetch para as categorias de comidas
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
      .then((response) => response.json())
      .then((data) => setMealsCategories(data.meals)) // seta o estado mealsCategories com todas as categorias de comidas
      .catch((error) => console.log(error.message));
  }, []);

  useEffect(() => { // fetch para as categorias de bebidas
    fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
      .then((response) => response.json())
      .then((data) => setDrinksCategories(data.drinks)) // seta o estado drinksCategories com todas as categorias de bebidas
      .catch((error) => console.log(error.message));
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
