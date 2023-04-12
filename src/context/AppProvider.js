import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

  // LocalStorage Receitas Favoritas

  const loadFavorites = () => JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');

  const saveFavorites = (favoriteRecipes) => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
  };

  const toggleFavorite = useCallback(() => {
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
  }, [favoriteIndex, isFavorite, recipe]);

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

  // LocalStorage Receitas em progresso

  const loadInProgressRecipes = () => JSON.parse(
    localStorage.getItem('inProgressRecipes') || '{ "meals": {}, "drinks": {} }', // pega a lista de receitas em progresso ou retorna um objeto vazio
  );

  const saveInProgressRecipes = (inProgressRecipes) => { // salva a lista de receitas em progresso
    localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
  };

  const markRecipeAsStarted = useCallback(() => { // função que marca a receita como iniciada
    if (!recipe) { // se recipe for null
      return; // retorna null
    }

    const inProgressRecipes = loadInProgressRecipes(); // se não, carrega as receitas em progresso

    const recipesMap = inProgressRecipes[`${recipe.type}s`]; // pega o tipo da receita

    if (!recipesMap[recipe.id]) { // se a receita não estiver no map
      recipesMap[recipe.id] = []; // adiciona a receita no map
    }

    saveInProgressRecipes(inProgressRecipes);
  }, [recipe]);

  useEffect(() => {
    if (recipe) { // se recipe for diferente de null
      const inProgressRecipes = loadInProgressRecipes(); // carrega as receitas em progresso

      const progress = inProgressRecipes[`${recipe.type}s`][recipe.id]; // pega o progresso da receita

      setInProgress(!!progress); // seta como true se progress for diferente de null
    } else {
      setInProgress(false);
    }
  }, [recipe]);

  // LocalStorage Receitas Feitas

  const loadDoneRecipes = useCallback(
    () => JSON.parse(localStorage.getItem('doneRecipes') || '[]'), // pega a lista de receitas feitas ou retorna um array vazio
    [],
  );

  const saveDoneRecipes = useCallback((doneRecipes) => { // salva a lista de receitas feitas
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
  }, []);

  const markRecipeAsDone = useCallback(() => { // marca a receita como feita
    if (!recipe || isDone) { // se recipe for null ou isDone for true,
      return; // retorna null
    }

    const doneRecipes = loadDoneRecipes(); // carrega as receitas feitas

    doneRecipes.push({ // adiciona a receita feita no array de receitas feitas
      ...recipe, // adiciona todas as propriedades de recipe
      doneDate: new Date().toISOString(), // adiciona a data de conclusão da receita
      tags, // adiciona as tags da receita (implementação futura)
    });

    setDoneIndex(doneRecipes.length - 1); // seta o index da receita feita como o tamanho do array - 1

    saveDoneRecipes(doneRecipes); // salva as receitas feitas
  }, [isDone, loadDoneRecipes, recipe, saveDoneRecipes, tags]);

  useEffect(() => {
    if (recipe) { // se recipe for diferente de null
      const doneRecipes = loadDoneRecipes(); // carrega as receitas feitas

      const recipeIndex = doneRecipes.findIndex((item) => item.id === recipe.id); // pega o index da receita feita

      setDoneIndex(recipeIndex); // seta o index da receita feita
    } else {
      setDoneIndex(NOT_FOUND); // ou seta o index da receita feita como -1 (não encontrado)
    }
  }, [recipe, loadDoneRecipes]);

  useEffect(() => { // quando o index da receita feita mudar
    setIsDone(doneIndex !== NOT_FOUND); // seta isDone como true se o index for diferente de -1
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
    toggleFavorite, markRecipeAsStarted, markRecipeAsDone,
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
