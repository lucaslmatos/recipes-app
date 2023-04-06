import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from '../pages/Profile';
import renderWithRouter from './helpers/renderWithRouter';

describe('Teste do componente <Profile />', () => {
  test('Se o botão "Done Recipes" aparece na tela e se ocorre redirecionamento', async () => {
    const { history } = renderWithRouter(<Profile />);

    const buttonDone = screen.getByTestId('profile-done-btn');
    expect(buttonDone).toBeInTheDocument();
    userEvent.click(buttonDone);

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/done-recipes');
    });
  });
  test('Se o botão "Favorite" aparece na tela e se ocorre redirecionamento', async () => {
    const { history } = renderWithRouter(<Profile />);

    const buttonFavorites = screen.getByTestId('profile-favorite-btn');
    expect(buttonFavorites).toBeInTheDocument();
    userEvent.click(buttonFavorites);

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/favorite-recipes');
    });
  });
  test('Se o botão "Logout" aparece na tela e se ocorre redirecionamento', async () => {
    const { history } = renderWithRouter(<Profile />);

    const buttonLogout = screen.getByTestId('profile-logout-btn');
    expect(buttonLogout).toBeInTheDocument();
    userEvent.click(buttonLogout);

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/');
    });
  });
});
