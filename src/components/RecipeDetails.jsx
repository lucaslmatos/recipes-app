import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import copy from 'clipboard-copy';
import AppContext from '../context/AppContext';
import fecthApi from '../servers/fetchApi';
import Recomendations from './Recomendations';
import '../styles/RecipeDetails.css';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

export default function RecipeDetails({ type }) {
  const { recipe, setRecipe, ingredients, setIngredients } = useContext(AppContext);
  const [isLoading, setLoading] = useState(true);
  const [checkBtnStart, setBtnStart] = useState(true);
  const [checkBtnProg, setBtnProg] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const check = type === 'meal' ? 'meals' : 'drinks';
  const check2 = type === 'meal' ? 'Meal' : 'Drink';
  const check3 = type === 'meal' ? 'meal' : 'drink';

  useEffect(() => {
    async function getList() {
      const fetchdata = await fecthApi(`https://www.the${type}db.com/api/json/v1/1/lookup.php?i=${id}`);
      setRecipe({ id, data: fetchdata }); // Guarda os dados da receita pelo ID no estado.
      const arr = [];
      const vinte = 20;
      const quinze = 15;
      const ingredientsNumber = type === 'meal' ? vinte : quinze;
      for (let i = 0; i < ingredientsNumber; i += 1) {
        const data = type === 'meal' ? fetchdata.meals[0][`strIngredient${i + 1}`]
          : fetchdata.drinks[0][`strIngredient${i + 1}`];
        if (data !== null && data !== '') { arr[i] = data; } // Pega os ingredientes e elimina os itens vazios da api.
      }
      setIngredients(arr); // Guarda os itens no estado.
      setLoading(false); // Desativa o loading
    }
    getList();
  }, [id, setRecipe, type, isLoading, setIngredients, setLoading]);

  useEffect(() => { // Confere se já existe uma chave com as receitas completadas e ativa o botão caso a receita atual não conste no localSotrage. Cria uma chave genérica caso não houver
    if ('doneRecipes' in localStorage) {
      const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
      if (doneRecipes.find((doneRec) => doneRec.id === id)) { setBtnStart(false); }
    } else {
      localStorage.setItem('doneRecipes', JSON.stringify([{ id: '' }]));
    }
  }, [id]);

  useEffect(() => { // Confere se já existe uma chave com as receitas em progresso e ativa o botão caso a receita atual não conste no localSotrage. Cria uma chave genérica caso não houver.
    if ('inProgressRecipes' in localStorage) {
      const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
      if (inProgressRecipes.drinks
        && Object.keys(inProgressRecipes.drinks).find((key) => key === id)) {
        setBtnProg(true);
      }
      if (inProgressRecipes.meals
        && Object.keys(inProgressRecipes.meals).find((key) => key === id)) {
        setBtnProg(true);
      }
    } else {
      localStorage.setItem('inProgressRecipes', JSON.stringify({
        drinks: { 15997: [] }, meals: { 52772: [] },
      }));
    }
  }, [id]);

  useEffect(() => {
    if ('favoriteRecipes' in localStorage) {
      const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
      if (favoriteRecipes.find((rec) => rec.id === id)) {
        setFavorite(true);
      }
    }
  }, [id]);

  function handleClick({ target: { name } }) {
    if (name === 'Start') { history.push(`${location.pathname}/in-progress`); }
    const actualRecipe = {
      id,
      type: check3,
      nationality: check === 'meals' ? recipe.data[check][0].strArea : '',
      category: recipe.data[check][0].strCategory,
      alcoholicOrNot: check === 'drinks' ? recipe.data[check][0].strAlcoholic : '',
      name: recipe.data[check][0][`str${check2}`],
      image: recipe.data[check][0][`str${check2}Thumb`],
    };
    if (name === 'Favorite' && 'favoriteRecipes' in localStorage) {
      const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
      if (!isFavorite) {
        favoriteRecipes.push(actualRecipe);
        localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
        setFavorite(true);
      } else {
        const newfavoriteecipes = favoriteRecipes.filter((e) => e.id !== id);
        localStorage.setItem('favoriteRecipes', JSON.stringify(newfavoriteecipes));
        setFavorite(false);
      }
    } else {
      localStorage.setItem('favoriteRecipes', JSON.stringify([actualRecipe]));
      setFavorite(true);
    }
    if (name === 'Share') {
      setLinkCopied(true);
      copy(`http://localhost:3000${location.pathname}`);
    }
  }

  if (!isLoading) {
    return (
      <div>
        <div>
          {
            recipe.data[check][0][`str${check2}Thumb`]
          && <img
            src={ recipe.data[check][0][`str${check2}Thumb`] }
            width="100px"
            alt={ [`str${check2}Thumb`] }
            data-testid="recipe-photo"
          />
          }
        </div>
        <div data-testid="recipe-title">
          {recipe.data[check][0][`str${check2}`]}
        </div>
        {check === 'meals'
          ? (
            <div data-testid="recipe-category">
              {recipe.data[check][0].strCategory}
            </div>)
          : (
            <div data-testid="recipe-category">
              {recipe.data[check][0].strAlcoholic}
            </div>)}
        <ul>
          {ingredients.map((__, index) => (
            <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
              {recipe.data[check][0][`strIngredient${index + 1}`]}
              {'     '}
              {recipe.data[check][0][`strMeasure${index + 1}`]}
            </li>
          ))}
        </ul>
        <div data-testid="instructions">
          {recipe.data[check][0].strInstructions}
        </div>
        {check === 'meals'
        && <iframe
          data-testid="video"
          width="360"
          height="200"
          src={ recipe.data.meals[0].strYoutube.replace('watch?v=', 'embed/') }
          title={ recipe.data.meals[0].strMeal }
        />}
        {check === 'meals'
          ? <Recomendations type="cocktail" /> : <Recomendations type="meal" />}
        <div className="social-buttons-div">
          <button
            name="Share"
            onClick={ handleClick }
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
            onClick={ handleClick }
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
        {checkBtnStart && !checkBtnProg
        && (
          <button
            data-testid="start-recipe-btn"
            name="Start"
            className="action-buttons"
            onClick={ handleClick }
          >
            Start Recipe
          </button>
        )}
        {checkBtnProg
        && (
          <button
            data-testid="start-recipe-btn"
            name="Continue"
            className="action-buttons"
          >
            Continue Recipe
          </button>
        )}
      </div>
    );
  }
}

RecipeDetails.propTypes = {
  type: PropTypes.string.isRequired,
};
