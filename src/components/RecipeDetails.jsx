import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import AppContext from '../context/AppContext';
import fecthApi from '../servers/fetchApi';
import Recomendations from './Recomendations';

export default function RecipeDetails({ type }) {
  const { recipe, setRecipe, ingredients, setIngredients } = useContext(AppContext);
  const [isLoading, setLoading] = useState(true);
  const [checkBtnStart, setBtnStart] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function getList() {
      const fetchdata = await fecthApi(`https://www.the${type}db.com/api/json/v1/1/lookup.php?i=${id}`);
      // Guarda os dados da receita pelo ID no estado.
      setRecipe({
        id,
        data: fetchdata,
      });
      // Pega os ingredientes e elimina os itens vazios da api.
      const arr = [];
      const vinte = 20;
      const quinze = 15;
      const ingredientsNumber = type === 'meal' ? vinte : quinze;
      for (let i = 0; i < ingredientsNumber; i += 1) {
        const data = type === 'meal' ? fetchdata.meals[0][`strIngredient${i + 1}`]
          : fetchdata.drinks[0][`strIngredient${i + 1}`];
        if (data !== null && data !== '') {
          arr[i] = data;
        }
      }
      // Guarda os itens no estado.
      setIngredients(arr);
      // Desativa o loading
      setLoading(false);
    }
    getList();
  }, [id, setRecipe, type, isLoading, setIngredients, setLoading]);

  useEffect(() => {
    // Confere se já existe uma chave com as receitas completadas e ativa o botão caso a receita atual não conste no localSotrage. Cria uma chave genérica caso não houver
    if ('doneRecipes' in localStorage) {
      const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
      if (!doneRecipes.includes((doneRec) => doneRec.id === id)) {
        setBtnStart(true);
      }
    } else {
      localStorage.setItem('doneRecipes', JSON.stringify([{
        id: '',
        type: '',
        nationality: '',
        category: '',
        alcoholicOrNot: '',
        name: '',
        image: '',
        doneDate: '',
        tags: '',
      }]));
    }
  }, [id]);

  if (!isLoading && type === 'meal') {
    return (
      <div>
        <div>
          {
            recipe.data.meals[0].strMealThumb
          && <img
            src={ recipe.data.meals[0].strMealThumb }
            width="100px"
            alt="strMealThumb"
            data-testid="recipe-photo"
          />
          }
        </div>
        <div data-testid="recipe-title">
          {recipe.data.meals[0].strMeal}
        </div>
        <div data-testid="recipe-category">
          {recipe.data.meals[0].strCategory}
        </div>
        <ul>
          {ingredients
            .map((__, index) => (
              <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
                {recipe.data.meals[0][`strIngredient${index + 1}`]}
                {'     '}
                {recipe.data.meals[0][`strMeasure${index + 1}`]}
              </li>
            ))}
        </ul>
        <div data-testid="instructions">
          {recipe.data.meals[0].strInstructions}
        </div>
        <iframe
          data-testid="video"
          width="360"
          height="200"
          src={ recipe.data.meals[0].strYoutube.replace('watch?v=', 'embed/') }
          title={ recipe.data.meals[0].strMeal }
        />
        <Recomendations type="cocktail" />
        {checkBtnStart
        && (
          <button
            data-testid="start-recipe-btn"
            style={ { position: 'fixed', bottom: '0px', left: '130px' } }
          >
            Start Recipe
          </button>
        )}
      </div>
    );
  }
  if (!isLoading && type === 'cocktail') {
    return (
      <div>
        <div>
          {
            recipe.data.drinks[0].strDrinkThumb
          && <img
            src={ recipe.data.drinks[0].strDrinkThumb }
            width="100px"
            alt="strDrinkThumb"
            data-testid="recipe-photo"
          />
          }
        </div>
        <div data-testid="recipe-title">
          {recipe.data.drinks[0].strDrink}
        </div>
        <div data-testid="recipe-category">
          {recipe.data.drinks[0].strAlcoholic}
          {'      '}
          drink.
        </div>
        <ul>
          {ingredients
            .map((__, index) => (
              <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
                {recipe.data.drinks[0][`strIngredient${index + 1}`]}
                {'     '}
                {recipe.data.drinks[0][`strMeasure${index + 1}`]}
              </li>
            ))}
        </ul>
        <div data-testid="instructions">
          {recipe.data.drinks[0].strInstructions}
        </div>
        <Recomendations type="meal" />
        {checkBtnStart
        && (
          <button
            data-testid="start-recipe-btn"
            style={ { position: 'fixed', bottom: '0px', left: '130px' } }
          >
            Start Recipe
          </button>
        )}
      </div>
    );
  }
}

RecipeDetails.propTypes = {
  type: PropTypes.string.isRequired,
};
