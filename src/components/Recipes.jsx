// Tela principal de receitas
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CategoriesContext from '../context/CategoriesContext';
import Categories from './Categories';

function Recipes({ type, recipes }) {
  const { mealsCategories, drinksCategories } = useContext(CategoriesContext);
  const maxCategory = 5;
  const slicedMealsCategories = mealsCategories.slice(0, maxCategory);
  const slicedDrinksCategories = drinksCategories.slice(0, maxCategory);
  return (
    <>
      <div>
        <Categories
          categories={ type === 'meal' ? slicedMealsCategories : slicedDrinksCategories }
        />
      </div>
      <div className="recipes">
        {recipes.map((recipe, index) => (
          <Link
            to={
              `/${type}s/${type === 'meal' ? recipe.idMeal : recipe.idDrink}` // recipe.idMeal || recipe.idDrink
            }
            key={ index }
          >
            <div data-testid={ `${index}-recipe-card` }>
              <img
                data-testid={ `${index}-card-img` }
                src={
                  `${recipe[type === 'meal' ? 'strMealThumb' : 'strDrinkThumb']}/preview`
                // recipe.strMealThumb || recipe.strDrinkThumb
                }
                alt={ type === 'meal' ? recipe.strMeal : recipe.strDrink }
              />
              <h3
                data-testid={ `${index}-card-name` }
              >
                {type === 'meal' ? recipe.strMeal : recipe.strDrink}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

Recipes.propTypes = {
  type: PropTypes.oneOf(['meal', 'drink']).isRequired,
  recipes: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        strMeal: PropTypes.string.isRequired,
        strMealThumb: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
    PropTypes.arrayOf(
      PropTypes.shape({
        strDrink: PropTypes.string.isRequired,
        strDrinkThumb: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  ]).isRequired,
};

export default Recipes;
