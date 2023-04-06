import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppContext from '../context/AppContext';
import fecthApi from '../servers/fetchApi';
import '../styles/RecipeDetails.css';

export default function Recomendations({ type }) {
  const { recomendations, setRecomendations } = useContext(AppContext);
  const [isLoading, setLoading] = useState(true);
  const six = 6;

  useEffect(() => {
    async function getList() {
      const recomendationsApi = await fecthApi(`https://www.the${type}db.com/api/json/v1/1/search.php?s=`);
      // Guarda os dados das recomendações no estado.
      const recomend = type === 'cocktail' ? recomendationsApi.drinks
        : recomendationsApi.meals;
      const recomndSlice = recomend.slice(0, six);
      setRecomendations(recomndSlice);
      setLoading(false);
    }
    getList();
  }, [type, setRecomendations, setLoading]);

  if (!isLoading && type === 'cocktail') {
    return (
      <div className="carousel-container">
        {
          recomendations.map((drink, index) => (
            <div
              key={ index }
              data-testid={ `${index}-recommendation-card` }
            >
              <img
                src={ drink.strDrinkThumb }
                alt={ drink.strDrink }
                className="carousel-image"
              />
              <div
                data-testid={ `${index}-recommendation-title` }
                className="carousel-text"
              >
                {drink.strDrink}
              </div>
            </div>
          ))
        }
      </div>
    );
  }
  if (!isLoading && type === 'meal') {
    return (
      <div className="carousel-container">
        {
          recomendations.map((Meal, index) => (
            <div
              key={ index }
              data-testid={ `${index}-recommendation-card` }
            >
              <img
                src={ Meal.strMealThumb }
                alt={ Meal.strMeal }
                className="carousel-image"
              />
              <div
                data-testid={ `${index}-recommendation-title` }
                className="carousel-text"
              >
                {Meal.strMeal}
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

Recomendations.propTypes = {
  type: PropTypes.string.isRequired,
};
