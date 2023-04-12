import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import AppContext from '../context/AppContext';
import { fetchRecipeByIdAndType, RecipeType } from '../servers/fetchApi';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

export default function RecipeInProgress({ type }) {
  const {
    recipe, setRecipe,
    ingredients, setIngredients,
    setInstructions, setVideoLink,
    setTags,
    toggleFavorite, isFavorite,
    markRecipeAsDone,
  } = useContext(AppContext);
  const [isLoading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [ingredientCheck, setIngredientCheck] = useState([]);
  const { id } = useParams();
  const history = useHistory();

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
  }, [id, setRecipe, setIngredients, type, setTags,
    setLoading, setInstructions, setVideoLink]);

  useEffect(() => {
    const newIngredientCheck = ingredients.map((ingredient) => ({
      name: ingredient.name,
      measure: ingredient.measure,
      checked: false,
    }));
    // TODO: também salvar no localStorage
    setIngredientCheck(newIngredientCheck);
  }, [ingredients]);

  const shareRecipe = () => {
    const path = recipe.type === RecipeType.MEAL ? 'meals' : 'drinks';
    copy(`http://localhost:3000/${path}/${id}`);
    setLinkCopied(true);
  };

  const finishRecipe = () => {
    markRecipeAsDone();
    history.push('/done-recipes');
  };

  if (!isLoading) { // Confere se os dados da receita já foram carregados
    return (
      <div>
        <div>
          {recipe.image && <img
            src={ recipe.image }
            width="200px"
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
        <ul style={ { listStyleType: 'none' } }>
          {ingredientCheck.map((ingredient, index) => (
            <li
              key={ index }
              data-testid={ `${index}-ingredient-step` }
              style={ { textDecoration: ingredient.checked
                ? 'line-through solid rgb(0,0,0)' : 'none' } }
            >
              <input
                type="checkbox"
                checked={ ingredient.checked }
                onChange={ () => {
                  const newList = [...ingredientCheck]; // Copia o array
                  newList[index].checked = !newList[index].checked; // Altera o valor do item para o oposto
                  setIngredientCheck(newList); // Atualiza o estado
                } }
              />
              {ingredient.name}
              -
              {ingredient.measure === null ? '' : ingredient.measure}
            </li>
          ))}
        </ul>
        <div data-testid="instructions">
          {recipe.instructions}
        </div>
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
            {isFavorite ? (
              <img
                data-testid="favorite-btn"
                name="Favorite"
                src={ blackHeartIcon }
                alt="share icon"
              />
            ) : (
              <img
                data-testid="favorite-btn"
                name="Favorite"
                src={ whiteHeartIcon }
                alt="share icon"
              />
            )}
          </button>
        </div>
        {linkCopied && <div> Link copied!</div>}
        <button
          data-testid="finish-recipe-btn"
          name="Finish"
          disabled={ !ingredientCheck.every((ingredient) => ingredient.checked) }
          onClick={ finishRecipe }
        >
          Finish Recipe
        </button>
      </div>
    );
  }
}

RecipeInProgress.propTypes = {
  type: PropTypes.oneOf(Object.values(RecipeType)).isRequired,
};
