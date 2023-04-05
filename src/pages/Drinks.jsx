// import React, { useContext, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
// import Footer from '../components/Footer';
// import Header from '../components/Header';
// import RecipesContext from '../context/RecipesContext';

// function Drinks() {
//   const { listMealsOrDrinks } = useContext(RecipesContext);
//   const history = useHistory();

//   useEffect(() => {
//     if (listMealsOrDrinks.length === 1) {
//       const idDrinkOrMeals = listMealsOrDrinks[0].idDrink;
//       history.push(`/drinks/${idDrinkOrMeals}`);
//     }
//   }, [listMealsOrDrinks, history]);
//   const maxNumber = 12;
//   const newListDrinks = listMealsOrDrinks.slice(0, maxNumber);

//   return (
//     <div>
//       <Header title="Drinks" hasSearchIcon />
//       { newListDrinks.map((product, index) => (
//         <div key={ product.strDrink } data-testid={ `${index}-recipe-card` }>
//           <p
//             data-testid={ `${index}-card-name` }
//           >
//             { product.strDrink }
//           </p>
//           <img
//             data-testid={ `${index}-card-img` }
//             src={ product.strDrinkThumb }
//             alt={ product.strDrink }
//           />
//         </div>
//       )) }
//       <Footer />
//     </div>
//   );
// }

// export default Drinks;

import React, { useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Recipes from '../components/Recipes';
import { MealsOrDrinksContext } from '../context/MealsOrDrinksProvider';

function Drinks() {
  const { drinksRecipes } = useContext(MealsOrDrinksContext);
  const maxCard = 12;
  const slicedDrinks = drinksRecipes.slice(0, maxCard);
  return (
    <div>
      <Header title="Drinks" hasSearchIcon />
      <Recipes type="drink" recipes={ slicedDrinks } />
      <Footer />
    </div>
  );
}

export default Drinks;
