import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import copy from 'clipboard-copy';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import '../styles/RecipeDetails.css';

function FavoriteRecipes() {
  const [list, setList] = useState([{}]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [indexClicked, setIndexClick] = useState('');

  useEffect(() => {
    if ('favoriteRecipes' in localStorage) {
      const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
      setList(favoriteRecipes);
    }
  }, [setList]);

  const handleFilter = ({ target: { name } }) => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const favMeals = favoriteRecipes.filter((meal) => meal.type === 'meal');
    const favDrinks = favoriteRecipes.filter((drink) => drink.type === 'drink');
    if (name === 'meals' && favMeals.length >= 1) {
      setList(favMeals);
    } else if (name === 'drinks' && favDrinks.length >= 1) {
      setList(favDrinks);
    } else if (name === 'all') {
      setList(favoriteRecipes);
    } else {
      setList([{}]);
    }
  };

  const handleShare = ({ target: { name, id, className } }) => {
    setLinkCopied(true);
    setIndexClick(className);
    const timer = 4000;
    setTimeout(() => setLinkCopied(false), timer);
    return copy(`http://localhost:3000/${name}s/${id}`);
  };

  const handleFavorite = () => {

  };

  return (
    <div>
      <Header title="Favorite Recipes" hasSearchIcon={ false } />
      <div className="section-container">
        <button
          type="button"
          data-testid="filter-by-meal-btn"
          name="meals"
          onClick={ handleFilter }
        >
          Meals
        </button>

        <button
          type="button"
          data-testid="filter-by-drink-btn"
          name="drinks"
          onClick={ handleFilter }
        >
          Drinks
        </button>

        <button
          type="button"
          data-testid="filter-by-all-btn"
          name="all"
          onClick={ handleFilter }
        >
          All
        </button>
      </div>
      <div>
        {list.map((favorite, index) => (
          <div key={ index }>
            <Link
              to={ `/${favorite.type}s/${favorite.id}` }
              className="card-title-favorite-link"
            >
              <img
                src={ favorite.image }
                alt={ favorite.type }
                className="carousel-image"
                data-testid={ `${index}-horizontal-image` }
              />
              <h3
                data-testid={ `${index}-horizontal-name` }
                className="card-title-favorite"
              >
                { favorite.name }
              </h3>

            </Link>
            <div>
              <button
                type="button"
                onClick={ handleFavorite }
              >
                <img
                  data-testid={ `${index}-horizontal-favorite-btn` }
                  src={ blackHeartIcon }
                  alt="Favorite Button"
                  id={ favorite.id }
                />
              </button>

              <button
                data-testid={ `${index}-horizontal-share-btn` }
                type="button"
                src={ shareIcon }
                onClick={ handleShare }
              >
                <img
                  src={ shareIcon }
                  alt="Share Button"
                  id={ favorite.id }
                  name={ favorite.type }
                  className={ index }
                />
              </button>
              {(linkCopied && indexClicked === String(index)) && <div> Link copied!</div>}
            </div>
            {/* <h4
              data-testid={ `${index}-horizontal-top-text` }
              className="card-subtitle-favorite"
            >
              { favorite.alcoholicOrNot.length > 1
                ? favorite.alcoholicOrNot
                : `${favorite.nationality} - ${favorite.category}` }
            </h4> */}

          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoriteRecipes;
