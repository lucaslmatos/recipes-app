import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import RecipesContext from './RecipesContext';

function RecipesProvider({ children }) {
  const [listMealsOrDrinks, setListMealsOrDrinks] = useState([]);

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
        listMealsOrDrinks, handleSetMealsOrDrinks };
    },
    [listMealsOrDrinks, setListMealsOrDrinks],
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
