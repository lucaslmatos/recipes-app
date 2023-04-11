import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import AppContext from '../context/AppContext';
import fetchApi from '../servers/fetchApi';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

export default function RecipeInProgress({ type }) {
  const { recipe, setRecipe, ingredients, setIngredients } = useContext(AppContext); // Pega os dados da receita pelo ID no estado.
  const [isLoading, setLoading] = useState(true); // Ativa o loading
  const [checkBtnStart, setBtnStart] = useState(true); // Ativa o botão de iniciar receita
  const [linkCopied, setLinkCopied] = useState(false); // Ativa o botão de copiar link
  const [isFavorite, setFavorite] = useState(false); // Ativa o botão de favoritar
  const [ingredientCheck, setIngredientCheck] = useState([]);
  const { id } = useParams(); // Pega o ID da receita através da URL.
  const history = useHistory(); // Pega o histórico de navegação armazenado no navegador.
  const check = type === 'meal' ? 'meals' : 'drinks'; // Verifica se é comida ou bebida e retorna o nome da chave.
  const check2 = type === 'meal' ? 'Meal' : 'Drink';
  const check3 = type === 'meal' ? 'meal' : 'drink';

  useEffect(() => {
    async function getList() { // Função para pegar os dados da receita pelo ID.
      const fetchdata = await fetchApi(`https://www.the${type}db.com/api/json/v1/1/lookup.php?i=${id}`); // Pega os dados da receita pelo ID.
      setRecipe({ id, data: fetchdata }); // Guarda os dados da receita pelo ID no estado global.
      const arr = []; // Cria um array vazio para armazenar os ingredientes.
      const vinte = 20;
      const quinze = 15;
      const ingredientsNumber = type === 'meal' ? vinte : quinze; // Verifica se é comida ou bebida e retorna o número de ingredientes.
      for (let i = 0; i < ingredientsNumber; i += 1) { // Para cada ingrediente, verifica se o item não é nulo e não está vazio.
        const data = type === 'meal' ? fetchdata.meals[0][`strIngredient${i + 1}`] // Pega o primeiro item do array e verifica se é comida ou bebida para pegar os ingredientes.
          : fetchdata.drinks[0][`strIngredient${i + 1}`]; // Pega o primeiro item do array e verifica se é comida ou bebida para pegar os ingredientes.
        if (data !== null && data !== '') { arr[i] = data; } // Pega os ingredientes e elimina os itens vazios da api.
      }
      setIngredients(arr); // Guarda os itens no estado.
      setLoading(false);
    }
    getList();
  }, [id, setRecipe, type, isLoading, setIngredients, setLoading]); // Atualiza o estado quando o ID, o tipo de receita e o loading mudarem.

  useEffect(() => { // Confere se já existe uma chave com as receitas completadas e ativa o botão caso a receita atual não conste no localSotrage. Cria uma chave genérica caso não houver
    if ('doneRecipes' in localStorage) { // Confere se já existe uma chave com as receitas completadas
      const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes')); // Pega os dados da chave doneRecipes salva no localStorage
      if (doneRecipes.find((doneRec) => doneRec.id === id)) { setBtnStart(false); } // Confere se a receita atual já está salva no localStorage, se sim, desativa o botão de iniciar receita
    } else { // Caso não haja uma chave com as receitas completadas, cria uma chave genérica
      localStorage.setItem('doneRecipes', JSON.stringify([{ id: '' }])); // Cria uma chave genérica
    }
  }, [id]); // Atualiza o estado quando o ID mudar.

  useEffect(() => { // Confere se já existe uma chave com as receitas favoritas e ativa o botão caso a receita atual não conste no localSotrage. Cria uma chave genérica caso não houver.
    if ('favoriteRecipes' in localStorage) { // Confere se já existe uma chave com as receitas favoritas
      const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')); // Pega os dados da chave favoriteRecipes salva no localStorage
      if (favoriteRecipes.find((rec) => rec.id === id)) { // Confere se a receita atual já está salva no localStorage, se sim, ativa o botão de favoritar receita
        setFavorite(true); // Ativa o botão de favoritar receita caso a receita atual já esteja salva no localStorage
      }
    }
  }, [id]);

  useEffect(() => {
    const newIngredientCheck = ingredients.map((ingredient) => ({
      name: ingredient,
      checked: false,
    }));
    setIngredientCheck(newIngredientCheck);
  }, [ingredients]);

  function handleClick({ target: { name } }) { // Função para ativar os botões de favoritar, iniciar e continuar receita
    const actualRecipe = { // Cria um objeto com os dados da receita atual
      id, // ID da receita
      type: check3, // Tipo de receita
      nationality: check === 'meals' ? recipe.data[check][0].strArea : '', // Nacionalidade da receita caso seja comida ou vazio caso seja bebida
      category: recipe.data[check][0].strCategory, // Categoria da receita
      alcoholicOrNot: check === 'drinks' ? recipe.data[check][0].strAlcoholic : '', // Tipo de bebida caso seja bebida ou vazio caso seja comida
      name: recipe.data[check][0][`str${check2}`], // Nome da receita
      image: recipe.data[check][0][`str${check2}Thumb`], // Imagem da receita
    };
    if (name === 'Favorite' && 'favoriteRecipes' in localStorage) { // Confere se já existe uma chave com as receitas favoritas
      const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')); // Pega os dados da chave favoriteRecipes salva no localStorage
      if (!isFavorite) { // Confere se a receita atual já está salva no localStorage, se não, salva a receita atual no localStorage
        favoriteRecipes.push(actualRecipe); // Salva a receita atual no localStorage
        localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes)); // Salva a receita atual no localStorage
        setFavorite(true);
      } else {
        const newfavoriteecipes = favoriteRecipes.filter((e) => e.id !== id); // Remove a receita atual do localStorage
        localStorage.setItem('favoriteRecipes', JSON.stringify(newfavoriteecipes)); // Remove a receita atual do localStorage
        setFavorite(false);
      }
    } else {
      localStorage.setItem('favoriteRecipes', JSON.stringify([actualRecipe]));
      setFavorite(true);
    }
    if (name === 'Share') { // Confere se o botão de compartilhar foi clicado
      setLinkCopied(true); // Ativa o estado de link copiado
      copy(`http://localhost:3000/${check}/${id}`); // Copia o link da receita atual
    }
    if (name === 'Finish') { history.push('/done-recipes'); }
  }

  if (!isLoading) { // Confere se os dados da receita já foram carregados
    return (
      <div>
        <div>
          {
            recipe.data[check][0][`str${check2}Thumb`] // Confere se a receita atual possui imagem e a renderiza
          && <img
            src={ recipe.data[check][0][`str${check2}Thumb`] }
            width="200px"
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
                  const newList = [...ingredientCheck];
                  newList[index].checked = !newList[index].checked;
                  setIngredientCheck(newList);
                } }
              />
              {ingredient.name}
            </li>
          ))}
        </ul>
        <div data-testid="instructions">
          {recipe.data[check][0].strInstructions}
        </div>
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
        {checkBtnStart
        && (
          <button
            data-testid="finish-recipe-btn"
            name="Finish"
            disabled={ !ingredientCheck.every((ingredient) => ingredient.checked) }
            onClick={ handleClick }
          >
            Finish Recipe
          </button>
        )}
      </div>
    );
  }
}

RecipeInProgress.propTypes = {
  type: PropTypes.oneOf(['meal', 'cocktail']).isRequired,
};
