import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import Header from '../components/Header';
import CategoriesProvider from '../context/CategoriesProvider';
import RecipesProvider from '../context/RecipesProvider';
import renderWithRouter from './helpers/renderWithRouter';

const email = 'lucaslopesm_22@hotmail.com';
const password = '1234567';
const emailId = 'email-input';
const passwordlId = 'password-input';

describe('Testes: Header', () => {
  test('Icons de search e profile exibidas no componente Header', () => {
    renderWithRouter(
      <RecipesProvider>
        <Header hasSearchIcon />
      </RecipesProvider>,
    );
    expect(screen.getByTestId('page-title')).toBeInTheDocument();
    expect(screen.getByTestId('profile-top-btn')).toBeInTheDocument();
    expect(screen.getByTestId('search-top-btn')).toBeInTheDocument();
  });
  test('Teste ao clicar no botão "search" aparece um input do type text', () => {
    renderWithRouter(
      <RecipesProvider>
        <Header hasSearchIcon />
      </RecipesProvider>,
    );
    const buttonSearch = screen.getByTestId('search-top-btn');
    userEvent.click(buttonSearch);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });
  test('Se ao clicar no botão "profile" direciona para rota profile', async () => {
    const { history } = renderWithRouter(
      <RecipesProvider>
        <CategoriesProvider>
          <App hasSearchIcon />
        </CategoriesProvider>
      </RecipesProvider>,
    );
    expect(screen.getByTestId(emailId)).toBeInTheDocument();
    expect(screen.getByTestId(passwordlId)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter/i })).toBeInTheDocument();

    userEvent.type(screen.getByTestId(emailId), email);
    userEvent.type(screen.getByTestId(passwordlId), password);
    const enter = screen.getByTestId('login-submit-btn');

    userEvent.click(enter);
    await waitFor(() => {
      expect(history.location.pathname).toEqual('/meals');
    });
    const buttonProfile = screen.getByTestId('profile-top-btn');
    userEvent.click(buttonProfile);
    await waitFor(() => {
      expect(history.location.pathname).toEqual('/profile');
    });
  });
});
