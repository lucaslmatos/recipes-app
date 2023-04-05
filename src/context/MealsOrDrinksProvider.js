// Criei outro context e provider pra salvar a requisição das receitas de comidas e bebidas, assim não preciso fazer a requisição toda vez que eu quiser acessar as receitas de comidas ou bebidas.
// Fiz um novo pra não confundir por enquanto, depois podemos refatorar e juntar tudo em um só.
// Vou usar no componente Recipes que renderiza as telas de Meals e Drinks.

import { createContext, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MealsOrDrinksContext = createContext();

function MealsOrDrinksProvider({ children }) {
  const [mealsRecipes, setMealsRecipes] = useState([]); // estado que armazena todas as receitas de comidas
  const [drinksRecipes, setDrinksRecipes] = useState([]); // estado que armazena todas as receitas de bebidas

  const contextRECIPES = useMemo(() => ({
    mealsRecipes,
    drinksRecipes,
  }), [mealsRecipes, drinksRecipes]);

  useEffect(() => { // fetch para as receitas de comidas
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then((response) => response.json())
      .then((data) => setMealsRecipes(data.meals)) // seta o estado mealsRecipes com todas as receitas de comidas
      .catch((error) => console.log(error.message));
  }, []);

  useEffect(() => { // fetch para as receitas de bebidas
    fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=')
      .then((response) => response.json())
      .then((data) => setDrinksRecipes(data.drinks)) // seta o estado drinksRecipes com todas as receitas de bebidas
      .catch((error) => console.log(error.message));
  }, []);

  return (
    <MealsOrDrinksContext.Provider value={ contextRECIPES }>
      {children}
    </MealsOrDrinksContext.Provider>
  );
}

MealsOrDrinksProvider.propTypes = {
  children: PropTypes.shape().isRequired,
};

export { MealsOrDrinksProvider, MealsOrDrinksContext };
