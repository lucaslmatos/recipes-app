import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppContext from '../context/AppContext';
import fecthApi from '../servers/fetchApi';

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
      <div
        style={ { display: 'flex',
          gap: '20px',
          overflow: 'scroll',
          overflowY: 'hidden',
          width: '360px',
          boxSizing: 'border-box',
          marginBottom: '50px' } }
      >
        {
          recomendations.map((drink, index) => (
            <div
              key={ index }
              data-testid={ `${index}-recommendation-card` }
            >
              <img
                src={ drink.strDrinkThumb }
                alt={ drink.strDrink }
                style={ { overflowClipMargin: 'content-box',
                  overflow: 'clip' } }
                width="170px"
              />
              <div
                data-testid={ `${index}-recommendation-title` }
                style={ { display: 'block', textAlign: 'center' } }
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
      <div
        style={ { display: 'flex',
          gap: '20px',
          overflow: 'scroll',
          overflowY: 'hidden',
          width: '360px',
          boxSizing: 'border-box',
          marginBottom: '50px' } }
      >
        {
          recomendations.map((Meal, index) => (
            <div
              key={ index }
              data-testid={ `${index}-recommendation-card` }
            >
              <img
                src={ Meal.strMealThumb }
                alt={ Meal.strMeal }
                style={ { overflowClipMargin: 'content-box',
                  overflow: 'clip' } }
                width="170px"
              />
              <div
                data-testid={ `${index}-recommendation-title` }
                style={ { display: 'block', textAlign: 'center' } }
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
