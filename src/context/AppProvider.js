import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import AppContext from './AppContext';

function AppProvider({ children }) {
  const [recipe, setRecipe] = useState({
    id: '',
    data: '',
  });

  const values = useMemo(() => ({
    recipe,
    setRecipe,
  }), [recipe]);

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
