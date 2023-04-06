import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppContext from '../context/AppContext';
import fecthApi from '../servers/fetchApi';
import '../styles/RecipeDetails.css';

export default function Recomendations({ type }) {
  const { recomendations, setRecomendations } = useContext(AppContext);
  const [isLoading, setLoading] = useState(true);
  const six = 6;
  const check2 = type === 'meal' ? 'Meal' : 'Drink';

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

  if (!isLoading) {
    return (
      <div className="carousel-container">
        {
          recomendations.map((item, index) => (
            <div
              key={ index }
              data-testid={ `${index}-recommendation-card` }
            >
              <img
                src={ item[`str${check2}Thumb`] }
                alt={ item[`str${check2}`] }
                className="carousel-image"
              />
              <div
                data-testid={ `${index}-recommendation-title` }
                className="carousel-text"
              >
                {item[`str${check2}`]}
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
