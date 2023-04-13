import copy from 'clipboard-copy';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';

function DoneMeals({ image, name, both, doneDate, index, tags, id }) {
  const [linkCopied, setLinkCopied] = useState(false);
  const handleClickCopied = () => {
    setLinkCopied(true);
    copy(`http://localhost:3000/meals/${id}`);
  };
  return (
    <div>

      <Link
        to={ `/meals/${id}` }
      >
        <img
          data-testid={ `${index}-horizontal-image` }
          src={ image }
          alt={ name }
          width="100"
          height="100"
        />
      </Link>

      <Link to={ `/meals/${id}` }>
        <p data-testid={ `${index}-horizontal-name` }>
          { name }
        </p>
      </Link>
      <p data-testid={ `${index}-horizontal-top-text` }>
        { both}
      </p>

      <p data-testid={ `${index}-horizontal-done-date` }>
        { doneDate }
      </p>

      {
        tags.map((tagName) => (
          <p
            key={ tagName }
            data-testid={ `${index}-${tagName}-horizontal-tag` }
          >
            { tagName }
          </p>
        ))
      }
      {linkCopied && <div> Link copied!</div>}
      <button
        type="button"
        onClick={ handleClickCopied }
      >
        <img
          data-testid={ `${index}-horizontal-share-btn` }
          name="Share"
          src={ shareIcon }
          alt="share icon"
        />
      </button>
    </div>
  );
}

DoneMeals.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  doneDate: PropTypes.number.isRequired,
  index: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  both: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default DoneMeals;
