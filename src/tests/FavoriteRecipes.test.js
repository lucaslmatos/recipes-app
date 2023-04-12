import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';

const favoritePage = '/favorite-recipes';
jest.mock('clipboard-copy', () => jest.fn());

describe('Testes: Página de Receitas Favoritas.', () => {
  test('Botão de profile, e de filtros, devem estar presentes ao iniciar a página, junto com a mensagem de vazio se não houver nenhuma receita favorita.', async () => {
    const { history } = renderWithRouter(<App />);

    localStorage.setItem('favoriteRecipes', JSON.stringify([]));

    act(() => {
      history.push(favoritePage);
    });
    await waitFor(() => {
      expect(screen.getByTestId(/profile-top-btn/i)).toBeInTheDocument();
      expect(screen.getByTestId(/page-title/i)).toBeInTheDocument();
      expect(screen.getByTestId(/filter-by-meal-btn/i)).toBeInTheDocument();
      expect(screen.getByTestId(/filter-by-drink-btn/i)).toBeInTheDocument();
      expect(screen.getByTestId(/filter-by-all-btn/i)).toBeInTheDocument();
      expect(screen.getByText(/Empty.../i)).toBeInTheDocument();
      userEvent.click(screen.getByTestId(/filter-by-meal-btn/i));
      userEvent.click(screen.getByTestId(/filter-by-drink-btn/i));
      userEvent.click(screen.getByTestId(/filter-by-all-btn/i));
      expect(screen.getByText(/Empty.../i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  test('Botão de compartilhar e botão de favorito devem estar presentes se houvre pelo menos uma receita nos favoitos, e os filtros devem funcionar para comida', async () => {
    const { history } = renderWithRouter(<App />);

    localStorage.setItem('favoriteRecipes', JSON.stringify([{
      id: '53060',
      type: 'meal',
      nationality: 'Croatian',
      category: 'Side',
      alcoholicOrNot: '',
      name: 'Burek',
      image: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
    }]));

    act(() => {
      history.push(favoritePage);
    });
    await waitFor(() => {
      userEvent.click(screen.getByTestId(/filter-by-meal-btn/i));
      expect(screen.getByTestId(/0-horizontal-image/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-name/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-favorite-btn/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-share-btn/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-top-text/i)).toBeInTheDocument();
      userEvent.click(screen.getByTestId(/filter-by-drink-btn/i));
      expect(screen.getByText(/Empty.../i)).toBeInTheDocument();
      userEvent.click(screen.getByTestId(/filter-by-all-btn/i));
      expect(screen.getByTestId(/0-horizontal-image/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-name/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-favorite-btn/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-share-btn/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-top-text/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  test('Botão de compartilhar e botão de favorito devem estar presentes se houvre pelo menos uma receita nos favoitos, e os filtros devem funcionar bebida', async () => {
    const { history } = renderWithRouter(<App />);

    localStorage.setItem('favoriteRecipes', JSON.stringify([{
      id: '15997',
      type: 'drink',
      nationality: '',
      category: 'Ordinary Drink',
      alcoholicOrNot: 'Optional alcohol',
      name: 'GG',
      image: 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg',
    }]));

    act(() => {
      history.push(favoritePage);
    });
    await waitFor(() => {
      userEvent.click(screen.getByTestId(/filter-by-drink-btn/i));
      expect(screen.getByTestId(/0-horizontal-image/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-name/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-favorite-btn/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-share-btn/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-top-text/i)).toBeInTheDocument();
      userEvent.click(screen.getByTestId(/filter-by-meal-btn/i));
      expect(screen.getByText(/Empty.../i)).toBeInTheDocument();
      userEvent.click(screen.getByTestId(/filter-by-all-btn/i));
      expect(screen.getByTestId(/0-horizontal-image/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-name/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-favorite-btn/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-share-btn/i)).toBeInTheDocument();
      expect(screen.getByTestId(/0-horizontal-top-text/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  test('Funcionalidade do botão de copiar e o comportamento da página ao clicar no botão de favoritos, que deve remover os itens', async () => {
    const { history } = renderWithRouter(<App />);

    localStorage.setItem('favoriteRecipes', JSON.stringify([{
      id: '15997',
      type: 'drink',
      nationality: '',
      category: 'Ordinary Drink',
      alcoholicOrNot: 'Optional alcohol',
      name: 'GG',
      image: 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg',
    }, {
      id: '53060',
      type: 'meal',
      nationality: 'Croatian',
      category: 'Side',
      alcoholicOrNot: '',
      name: 'Burek',
      image: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
    }]));

    act(() => {
      history.push(favoritePage);
    });

    await waitFor(() => {
      userEvent.click(screen.getByTestId(/0-horizontal-share-btn/i));
      userEvent.click(screen.getByTestId(/1-horizontal-share-btn/i));
      waitFor(() => { expect(screen.queryByText(/ Link copied!/i)).toHaveLength(1); });
      userEvent.click(screen.getByTestId(/1-horizontal-favorite-btn/i));
      userEvent.click(screen.getByTestId(/0-horizontal-favorite-btn/i));
    }, { timeout: 4000 });
  });

  test('Página deve iniciar normalmente mesmo se não houver chave de Favoritos no local storage', async () => {
    const { history } = renderWithRouter(<App />);

    localStorage.clear();

    act(() => {
      history.push(favoritePage);
    });
  });
});
