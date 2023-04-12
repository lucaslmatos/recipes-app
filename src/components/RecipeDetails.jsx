import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import copy from 'clipboard-copy';
import AppContext from '../context/AppContext';
import { fetchRecipeByIdAndType, RecipeType } from '../servers/fetchApi';
import Recomendations from './Recomendations';
import '../styles/RecipeDetails.css';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

export default function RecipeDetails({ type, recommendationType }) {
  const {
    recipe, setRecipe,
    ingredients, setIngredients,
    instructions, setInstructions,
    videoLink, setVideoLink,
    setTags,
    toggleFavorite, isFavorite,
    inProgress, isDone, markRecipeAsStarted,
  } = useContext(AppContext);
  const [isLoading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    async function fetchRecipe() {
      setLoading(true);

      try {
        const info = await fetchRecipeByIdAndType(id, type);

        if (info) {
          setRecipe(info.recipe);
          setIngredients(info.ingredients);
          setInstructions(info.instructions);
          setVideoLink(info.videoLink);
          setTags(info.tags);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [
    id, setRecipe, setIngredients, type,
    setLoading, setInstructions, setVideoLink, setTags,
  ]);

  const startRecipe = () => {
    markRecipeAsStarted();
    history.push(location.pathname.concat('/in-progress'));
  };

  const shareRecipe = () => {
    const path = recipe.type === RecipeType.MEAL ? 'meals' : 'drinks';
    copy(`http://localhost:3000/${path}/${id}`);
    setLinkCopied(true);
  };

  if (!isLoading) {
    return (
      <div>
        <div>
          {recipe.image && <img
            src={ recipe.image }
            width="100px"
            alt={ recipe.image }
            data-testid="recipe-photo"
          />}
        </div>
        <div data-testid="recipe-title">
          {recipe.name}
        </div>
        <div data-testid="recipe-category">
          {recipe.type === RecipeType.MEAL ? recipe.category : recipe.alcoholicOrNot}
        </div>
        <ul>
          {ingredients.map(({ name, measure }, index) => (
            <li
              key={ name }
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              {`${name}     ${measure}`}
            </li>
          ))}
        </ul>
        <div data-testid="instructions">
          {instructions}
        </div>
        {type === RecipeType.MEAL && (
          <iframe
            data-testid="video"
            width="360"
            height="200"
            src={ videoLink }
            title={ recipe.name }
          />
        )}

        <Recomendations type={ recommendationType } />

        <div className="social-buttons-div">
          <button
            name="Share"
            onClick={ shareRecipe }
          >
            <img
              data-testid="share-btn"
              name="Share"
              src={ shareIcon }
              alt="share icon"
            />
          </button>
          <button
            name="Favorite"
            src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
            onClick={ toggleFavorite }
          >
            {isFavorite
              ? (
                <img
                  data-testid="favorite-btn"
                  name="Favorite"
                  src={ blackHeartIcon }
                  alt="share icon"
                />)
              : (
                <img
                  data-testid="favorite-btn"
                  name="Favorite"
                  src={ whiteHeartIcon }
                  alt="share icon"
                />)}
          </button>
        </div>
        {linkCopied && <div> Link copied!</div>}

        {!isDone && (
          <button
            data-testid="start-recipe-btn"
            name={ inProgress ? 'Continue Recipe' : 'Start Recipe' }
            className="action-buttons"
            onClick={ startRecipe }
          >
            {inProgress ? 'Continue Recipe' : 'Start Recipe'}
          </button>
        )}
      </div>
    );
  }
}

RecipeDetails.propTypes = {
  type: PropTypes.oneOf(Object.values(RecipeType)).isRequired,
  recommendationType: PropTypes.oneOf(Object.values(RecipeType)).isRequired,
};
