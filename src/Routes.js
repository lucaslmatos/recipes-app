import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DoneRecipes from './pages/DoneRecipes';
import Drinks from './pages/Drinks';
import DrinksProgress from './pages/DrinksProgress';
import DrinksRecipes from './pages/DrinksRecipes';
import FavoriteRecipes from './pages/FavoriteRecipes';
import Login from './pages/Login';
import Meals from './pages/Meals';
import MealsProgress from './pages/MealsProgress';
import MealsRecipes from './pages/MealsRecipes';
import Profile from './pages/Profile';

function Routes() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route exact path="/meals" component={ Meals } />
        <Route exact path="/drinks" component={ Drinks } />
        <Route exact path="/meals/:id-da-receita" component={ MealsRecipes } />
        <Route exact path="/drinks/:id-da-receita" component={ DrinksRecipes } />
        <Route path="/meals/:id-da-receita/in-progress" component={ MealsProgress } />
        <Route path="/drinks/:id-da-receita/in-progress" component={ DrinksProgress } />
        <Route exact path="/profile" component={ Profile } />
        <Route exact path="/done-recipes" component={ DoneRecipes } />
        <Route exact path="/favorite-recipes" component={ FavoriteRecipes } />
      </Switch>
    </div>
  );
}

export default Routes;
