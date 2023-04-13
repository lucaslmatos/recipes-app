import copy from 'clipboard-copy';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';

function DoneDrinks({ image, name, alcoholicOrNot, doneDate, index, id }) {
  const [linkCopied, setLinkCopied] = useState(false);
  const handleClickCopied = () => {
    setLinkCopied(true);
    copy(`http://localhost:3000/drinks/${id}`);
  };
  return (
    <div>
      <Link
        to={ `/drinks/${id}` }
      >
        <img
          data-testid={ `${index}-horizontal-image` }
          src={ image }
          alt={ name }
          width="100"
          height="100"
        />
      </Link>
      <Link
        to={ `/drinks/${id}` }
      >
        <p data-testid={ `${index}-horizontal-name` }>
          { name }
        </p>
      </Link>
      <p data-testid={ `${index}-horizontal-top-text` }>
        { alcoholicOrNot }
      </p>
      <p data-testid={ `${index}-horizontal-done-date` }>
        { doneDate }
      </p>
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

DoneDrinks.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  alcoholicOrNot: PropTypes.string.isRequired,
  doneDate: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default DoneDrinks;
