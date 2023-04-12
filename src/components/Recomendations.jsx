import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppContext from '../context/AppContext';
import { RecipeType, fetchRecommendationsByType } from '../servers/fetchApi';
import '../styles/RecipeDetails.css';

export default function Recomendations({ type }) {
  const { recommendations, setRecommendations } = useContext(AppContext);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function getList() {
      setLoading(true);

      try {
        setRecommendations(
          await fetchRecommendationsByType(type),
        );
      } finally {
        setLoading(false);
      }
    }
    getList();
  }, [type, setRecommendations, setLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="carousel-container">
      {
        recommendations.map(({ recipe }, index) => (
          <div
            key={ index }
            data-testid={ `${index}-recommendation-card` }
          >
            <img
              src={ recipe.image }
              alt={ recipe.name }
              className="carousel-image"
            />
            <div
              data-testid={ `${index}-recommendation-title` }
              className="carousel-text"
            >
              {recipe.name}
            </div>
          </div>
        ))
      }
    </div>
  );
}

Recomendations.propTypes = {
  type: PropTypes.oneOf(Object.values(RecipeType)).isRequired,
};
