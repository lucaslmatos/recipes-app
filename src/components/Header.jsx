import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';

function Header({ title, hasSearchIcon }) {
  const history = useHistory();
  const [showInput, setShowinput] = useState(false);

  const handleButtonProfile = () => {
    history.push('/profile');
  };

  const handleButtonSearch = () => {
    setShowinput(
      !showInput,
    );
  };

  return (
    <div>
      <h1 data-testid="page-title">
        { title }
      </h1>
      <button
        onClick={ handleButtonProfile }
      >
        <img src={ profileIcon } alt="profile icon" data-testid="profile-top-btn" />
      </button>

      { hasSearchIcon
      && (
        <div>
          { showInput
          && <input
            data-testid="search-input"
            type="text"
          />}
          <button
            onClick={ handleButtonSearch }
          >
            <img src={ searchIcon } alt="search icon" data-testid="search-top-btn" />
          </button>
        </div>
      )}
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  hasSearchIcon: PropTypes.bool.isRequired,
};

export default Header;
