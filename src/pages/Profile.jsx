import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

function Profile() {
  const [profileEmail, setProfileEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    const { email } = JSON.parse(localStorage.getItem('user')) || {};
    setProfileEmail(
      email,
    );
  }, []);
  return (
    <div>
      <Header title="Profile" hasSearchIcon={ false } />
      <p data-testid="profile-email">
        { profileEmail }
      </p>
      <button
        data-testid="profile-done-btn"
        onClick={ () => { history.push('/done-recipes'); } }
      >
        Done Recipes
      </button>
      <button
        data-testid="profile-favorite-btn"
        onClick={ () => { history.push('/favorite-recipes'); } }
      >
        Favorite Recipes
      </button>
      <button
        data-testid="profile-logout-btn"
        onClick={ () => {
          localStorage.clear();
          history.push('/');
        } }
      >
        Logout
      </button>
      <Footer />
    </div>
  );
}

export default Profile;
