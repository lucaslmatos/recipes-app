// import React, { useContext, useEffect } from 'react';
// import Footer from '../components/Footer';
// import Header from '../components/Header';
// import RecipesContext from '../context/RecipesContext';

// function Meals() {
//   const maxNumber = 12;
//   const newListMeals = listMealsOrDrinks.slice(0, maxNumber);

//   return (
//     <div>
//       <Header title="Meals" hasSearchIcon />
//       { newListMeals.map((product, index) => (
//         <div key={ product.strMeal } data-testid={ `${index}-recipe-card` }>
//           <p
//             data-testid={ `${index}-card-name` }
//           >
//             { product.strMeal }
//           </p>
//           <img
//             data-testid={ `${index}-card-img` }
//             src={ product.strMealThumb }
//             alt={ product.strMeal }
//           />
//         </div>
//       )) }
//       <Footer />
//     </div>
//   );
// }

// export default Meals;

import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Recipes from '../components/Recipes';
import { MealsOrDrinksContext } from '../context/MealsOrDrinksProvider';

function Meals() {
  const { mealsRecipes } = useContext(MealsOrDrinksContext);
  const history = useHistory();

  useEffect(() => {
    if (mealsRecipes.length === 1) {
      const idMeals = mealsRecipes[0].idMeal;
      history.push(`/meals/${idMeals}`);
    }
  }, [mealsRecipes, history]);

  const maxCard = 12;
  const slicedMeals = mealsRecipes.slice(0, maxCard);

  return (
    <div>
      <Header title="Meals" hasSearchIcon />
      <Recipes type="meal" recipes={ slicedMeals } />
      <Footer />
    </div>
  );
}

export default Meals;
