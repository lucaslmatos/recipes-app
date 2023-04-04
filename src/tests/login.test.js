import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';

const email = 'lucaslopesm_22@hotmail.com';
const password = '1234567';
const emailId = 'email-input';
const passwordlId = 'password-input';

describe('Testes: Página de Login.', () => {
  test('Deve existir o campo de email, senha, e o botão de entrar', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId(emailId)).toBeInTheDocument();
    expect(screen.getByTestId(passwordlId)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter/i })).toBeInTheDocument();
  });
  test('O botão de entrar deve estar habilitado apenas após o usuário digitar email e senha válidos', () => {
    renderWithRouter(<App />);
    expect(screen.getByRole('button', { name: /Enter/i })).toBeDisabled();
    userEvent.type(screen.getByTestId(emailId), email);
    userEvent.type(screen.getByTestId(passwordlId), password);
    expect(screen.getByRole('button', { name: /Enter/i })).toBeEnabled();
  });
  test('Verifica se ao clicar no botão Enter ele redireciona para rota /meals', async () => {
    const { history } = renderWithRouter(<App />);
    const enter = screen.getByTestId('login-submit-btn');
    userEvent.type(screen.getByTestId(passwordlId), password);
    userEvent.type(screen.getByTestId(emailId), email);
    userEvent.click(enter);
    await waitFor(() => {
      expect(history.location.pathname).toEqual('/meals');
    });
  });
});
