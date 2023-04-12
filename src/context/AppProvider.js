import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import AppContext from './AppContext';

const NOT_FOUND = -1;

function AppProvider({ children }) {
  const [recipe, setRecipe] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [tags, setTags] = useState([]);

  const [recommendations, setRecommendations] = useState([]);

  const [favoriteIndex, setFavoriteIndex] = useState(NOT_FOUND);
  const [isFavorite, setIsFavorite] = useState(false);

  const [inProgress, setInProgress] = useState(false);

  const [doneIndex, setDoneIndex] = useState(NOT_FOUND);
  const [isDone, setIsDone] = useState(false);

  const loadFavorites = () => JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');

  const saveFavorites = (favoriteRecipes) => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
  };

  const toggleFavorite = () => {
    if (!recipe) {
      return;
    }

    const favoriteRecipes = loadFavorites();

    if (isFavorite) {
      favoriteRecipes.splice(favoriteIndex, 1);
      setFavoriteIndex(NOT_FOUND);
    } else {
      favoriteRecipes.push(recipe);
      setFavoriteIndex(favoriteRecipes.length - 1);
    }

    saveFavorites(favoriteRecipes);
  };

  useEffect(() => {
    if (recipe) {
      const favoriteRecipes = loadFavorites();

      const recipeIndex = favoriteRecipes.findIndex((item) => item.id === recipe.id);

      setFavoriteIndex(recipeIndex);
    } else {
      setFavoriteIndex(NOT_FOUND);
    }
  }, [recipe]);

  useEffect(() => {
    setIsFavorite(favoriteIndex !== NOT_FOUND);
  }, [favoriteIndex]);

  const loadInProgressRecipes = () => JSON.parse(
    localStorage.getItem('inProgressRecipes') || '{ "meals": {}, "drinks": {} }',
  );

  const saveInProgressRecipes = (inProgressRecipes) => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
  };

  const markRecipeAsStarted = () => {
    if (!recipe) {
      return;
    }

    const inProgressRecipes = loadInProgressRecipes();

    const recipesMap = inProgressRecipes[`${recipe.type}s`];

    if (!recipesMap[recipe.id]) {
      recipesMap[recipe.id] = [];
    }

    saveInProgressRecipes(inProgressRecipes);
  };

  useEffect(() => {
    if (recipe) {
      const inProgressRecipes = loadInProgressRecipes();

      const progress = inProgressRecipes[`${recipe.type}s`][recipe.id];

      setInProgress(!!progress);
    } else {
      setInProgress(false);
    }
  }, [recipe]);

  const loadDoneRecipes = () => JSON.parse(localStorage.getItem('doneRecipes') || '[]');

  const saveDoneRecipes = (doneRecipes) => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
  };

  const markRecipeAsDone = () => {
    if (!recipe || isDone) {
      return;
    }

    const doneRecipes = loadDoneRecipes();

    doneRecipes.push({
      ...recipe,
      doneDate: new Date().toISOString(),
      tags,
    });

    setDoneIndex(doneRecipes.length - 1);

    saveDoneRecipes(doneRecipes);
  };

  useEffect(() => {
    if (recipe) {
      const doneRecipes = loadDoneRecipes();

      const recipeIndex = doneRecipes.findIndex((item) => item.id === recipe.id);

      setDoneIndex(recipeIndex);
    } else {
      setDoneIndex(NOT_FOUND);
    }
  }, [recipe]);

  useEffect(() => {
    setIsDone(doneIndex !== NOT_FOUND);
  }, [doneIndex]);

  const values = useMemo(() => ({
    recipe,
    setRecipe,
    ingredients,
    setIngredients,
    instructions,
    setInstructions,
    videoLink,
    setVideoLink,
    tags,
    setTags,
    recommendations,
    setRecommendations,
    isFavorite,
    toggleFavorite,
    inProgress,
    markRecipeAsStarted,
    isDone,
    markRecipeAsDone,
  }), [
    recipe, ingredients, instructions, videoLink, tags,
    recommendations, isFavorite, inProgress, isDone,
  ]);

  return (
    <AppContext.Provider value={ values }>
      { children }
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
