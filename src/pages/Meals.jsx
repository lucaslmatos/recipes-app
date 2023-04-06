import React, { useContext } from 'react';
// import { useHistory } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Recipes from '../components/Recipes';
import RecipesContext from '../context/RecipesContext';

function Meals() {
  const { listMealsOrDrinks } = useContext(RecipesContext);
  // const history = useHistory();

  // Tirei o useEffect aqui, pois estava dando conflito com a lógica do SearchBar.

  // useEffect(() => {
  //   if (listMealsOrDrinks.length === 1) {
  //     const idDrinkOrMeals = listMealsOrDrinks[0].idMeal;
  //     history.push(`/meals/${idDrinkOrMeals}`);
  //   }
  // }, [listMealsOrDrinks, history]);
  const maxNumber = 12;
  const newListDrinks = listMealsOrDrinks.slice(0, maxNumber);

  return (
    <div>
      <Header title="Meals" hasSearchIcon />
      <Recipes type="meal" recipes={ newListDrinks } />
      <Footer />
    </div>
  );
}

export default Meals;
