import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Recipes from '../components/Recipes';
import RecipesContext from '../context/RecipesContext';

function Drinks() {
  const { listMealsOrDrinks } = useContext(RecipesContext);
  const history = useHistory();

  useEffect(() => {
    if (listMealsOrDrinks.length === 1) {
      const idDrinkOrMeals = listMealsOrDrinks[0].idDrink;
      history.push(`/drinks/${idDrinkOrMeals}`);
    }
  }, [listMealsOrDrinks, history]);
  const maxNumber = 12;
  const newListDrinks = listMealsOrDrinks.slice(0, maxNumber);

  return (
    <div>
      <Header title="Drinks" hasSearchIcon />
      <Recipes type="drink" recipes={ newListDrinks } />
      <Footer />
    </div>
  );
}

export default Drinks;
