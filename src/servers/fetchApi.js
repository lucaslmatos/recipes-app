const fetchApi = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export default fetchApi;

export const RecipeType = {
  MEAL: 'meal',
  DRINK: 'drink',
};

const mealToRecipe = (meal) => {
  const {
    idMeal, strMeal, strMealThumb, strCategory,
    strArea, strInstructions, strYoutube, strTags,
  } = meal;

  const MAX_INGREDIENTS = 20;
  const mealIngredients = [];

  for (let i = 1; i <= MAX_INGREDIENTS; i += 1) {
    const ingredient = meal[`strIngredient${i}`]?.trim(' '); // trim() remove espaços em branco no início e no fim de uma string
    const measure = meal[`strMeasure${i}`]?.trim(' ');
    if (!measure && ingredient) { // se o ingrediente não existir
      mealIngredients.push({ // adiciona o ingrediente no array de ingredientes
        name: ingredient, // nome do ingrediente
      });
    }
    if (measure && ingredient) {
      mealIngredients.push({
        name: ingredient,
        measure,
      });
    }
  }

  return {
    recipe: {
      id: idMeal,
      type: RecipeType.MEAL,
      nationality: strArea,
      category: strCategory,
      alcoholicOrNot: '',
      name: strMeal,
      image: strMealThumb,
    },
    ingredients: mealIngredients,
    instructions: strInstructions,
    videoLink: strYoutube?.replace('watch?v=', 'embed/'),
    tags: strTags?.split(',') ?? [],
  };
};

export const fetchMealRecipeById = async (recipeId) => {
  const data = await fetchApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
  if (!data) {
    return null;
  }

  const [meal] = data.meals;

  return mealToRecipe(meal);
};

const drinkToRecipe = (drink) => {
  const {
    idDrink, strDrink, strDrinkThumb, strCategory,
    strAlcoholic, strInstructions, strVideo, strTags,
  } = drink;

  const MAX_INGREDIENTS = 15;
  const drinkIngredients = [];

  for (let i = 1; i <= MAX_INGREDIENTS; i += 1) {
    const ingredient = drink[`strIngredient${i}`]?.trim(' ');
    const measure = drink[`strMeasure${i}`]?.trim(' ');
    if (!measure && ingredient) {
      drinkIngredients.push({
        name: ingredient,
        measure: '',
      });
    }
    if (measure && ingredient) {
      drinkIngredients.push({
        name: ingredient,
        measure,
      });
    }
  }

  return {
    recipe: {
      id: idDrink,
      type: RecipeType.DRINK,
      nationality: '',
      category: strCategory,
      alcoholicOrNot: strAlcoholic,
      name: strDrink,
      image: strDrinkThumb,
    },
    ingredients: drinkIngredients,
    instructions: strInstructions,
    videoLink: strVideo,
    tags: strTags?.split(',') ?? [],
  };
};

export const fetchDrinkRecipeById = async (recipeId) => {
  const data = await fetchApi(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
  if (!data) {
    return null;
  }

  const [drink] = data.drinks;

  return drinkToRecipe(drink);
};

export const fetchRecipeByIdAndType = async (recipeId, recipeType) => {
  switch (recipeType) {
  case RecipeType.MEAL:
    return fetchMealRecipeById(recipeId);
  case RecipeType.DRINK:
    return fetchDrinkRecipeById(recipeId);
  default:
    throw new Error(`Unexpected recipe type: ${recipeType}`);
  }
};

const MAX_RECOMMENDATIONS = 6;

export const fetchMealRecommendations = async () => {
  const { meals } = await fetchApi('https://www.themealdb.com/api/json/v1/1/search.php?s=');

  return meals.slice(0, MAX_RECOMMENDATIONS)
    .map(mealToRecipe);
};

export const fetchDrinkRecommendations = async () => {
  const { drinks } = await fetchApi('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');

  return drinks.slice(0, MAX_RECOMMENDATIONS)
    .map(drinkToRecipe);
};

export const fetchRecommendationsByType = async (recipeType) => {
  switch (recipeType) {
  case RecipeType.MEAL:
    return fetchMealRecommendations();
  case RecipeType.DRINK:
    return fetchDrinkRecommendations();
  default:
    throw new Error(`Unexpected recipe type: ${recipeType}`);
  }
};
