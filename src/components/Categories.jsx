import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import RecipesContext from '../context/RecipesContext';

/* Adicionar um listener de eventos ao botão de filtro de categoria (por exemplo, um dropdown ou uma lista de botões de categoria).
Quando o usuário selecionar uma categoria, chamar a API de comidas ou bebidas usando o endpoint de filtro por categoria correspondente à categoria selecionada.
Obter a lista de receitas filtrada da resposta da API e exibir as receitas na tela.
Se o usuário clicar no botão "All", chamar a API novamente sem passar nenhum parâmetro de categoria e exibir todas as receitas na tela.
Se a categoria selecionada retornar apenas um resultado, exibir a receita na tela sem redirecionar para a página de detalhes.
 */

function Categories({ categories }) {
  // const { listMealsOrDrinks, setListMealsOrDrinks } = useContext(RecipesContext);
  const { setCategory } = useContext(RecipesContext);
  const [selectedCategory, setSelectedCategory] = useState('');

  // se clicar no botão de categoria mais uma vez, ele deve tirar o filtro adicionado
  const handleClick = (category) => {
    if (category === selectedCategory) {
      setSelectedCategory('');
      setCategory('');
    } else {
      setSelectedCategory(category);
      setCategory(category);
    }
  };

  return (
    <div className="categories">
      <button
        type="button"
        data-testid="All-category-filter"
        onClick={ () => handleClick('') }
        className={ selectedCategory === '' ? 'selected' : '' }
      >
        All
      </button>
      {categories.map((category, index) => (
        <button
          type="button"
          key={ index }
          data-testid={ `${category.strCategory}-category-filter` }
          onClick={ () => handleClick(category.strCategory) }
          className={ selectedCategory === category.strCategory ? 'selected' : '' }
        >
          {category.strCategory}
        </button>
      ))}
    </div>
  );
}

Categories.propTypes = {
  categories: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        strCategory: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  ]).isRequired,
};

export default Categories;
