import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import AppContext from './AppContext';

function AppProvider({ children }) {
  const [recipe, setRecipe] = useState({
    id: '',
    data: '',
  });
  const [ingredients, setIngredients] = useState([]);
  const [recomendations, setRecomendations] = useState();

  const values = useMemo(() => ({
    recipe,
    setRecipe,
    ingredients,
    setIngredients,
    recomendations,
    setRecomendations,
  }), [recipe, ingredients, recomendations]);

  return (
    <AppContext.Provider value={ values }>
      { children }
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
