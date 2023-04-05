import React from 'react';
import PropTypes from 'prop-types';

function Categories({ categories }) {
  return (
    <div className="categories">
      {categories.map((category, index) => (
        <button
          type="button"
          key={ index }
          data-testid={ `${category.strCategory}-category-filter` }
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
