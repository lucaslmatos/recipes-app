import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RecipesContext from '../context/RecipesContext';

function Meals() {
  const { listMealsOrDrinks } = useContext(RecipesContext);
  const history = useHistory();

  useEffect(() => {
    if (listMealsOrDrinks.length === 1) {
      const idDrinkOrMeals = listMealsOrDrinks[0].idMeal;
      history.push(`/meals/${idDrinkOrMeals}`);
    }
  }, [listMealsOrDrinks, history]);
  const maxNumber = 12;
  const newListMeals = listMealsOrDrinks.slice(0, maxNumber);

  return (
    <div>
      <Header title="Meals" hasSearchIcon />
      { newListMeals.map((product, index) => (
        <div key={ product.strMeal } data-testid={ `${index}-recipe-card` }>
          <p
            data-testid={ `${index}-card-name` }
          >
            { product.strMeal }
          </p>
          <img
            data-testid={ `${index}-card-img` }
            src={ product.strMealThumb }
            alt={ product.strMeal }
          />
        </div>
      )) }
      <Footer />
    </div>
  );
}

export default Meals;
