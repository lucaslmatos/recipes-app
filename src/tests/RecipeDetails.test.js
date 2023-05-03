import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helpers/renderWithRouter';
import App from '../App';

const meals = '/meals/52772';
const black = 'blackHeartIcon.svg';
const white = 'whiteHeartIcon.svg';

jest.mock('clipboard-copy', () => jest.fn());

describe('Testes: Página de Detalhes da Receita.', () => {
  test('Informações sobre receita de comidas aparecem na tela', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push(meals);
    });

    await waitFor(() => {
      expect(screen.getByTestId(/recipe-photo/i)).toBeInTheDocument();
      expect(screen.getByTestId(/recipe-title/i)).toBeInTheDocument();
      expect(screen.getByTestId(/recipe-category/i)).toBeInTheDocument();
      expect(screen.getAllByTestId(/-ingredient-name-and-measure/i)).toHaveLength(9);
      expect(screen.getByTestId(/instructions/i)).toBeInTheDocument();
      expect(screen.getByTestId(/video/i)).toBeInTheDocument();
      expect(screen.getAllByTestId(/-recommendation-card/i)).toHaveLength(6);
      expect(screen.getAllByTestId(/-recommendation-title/i)).toHaveLength(6);
      expect(screen.getByTestId(/start-recipe-btn/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  test('Informações sobre receita de bebidas aparecem na tela', async () => {
    const { history } = renderWithRouter(<App />);
    localStorage.clear();
    act(() => {
      history.push('/drinks/17222');
    });

    await waitFor(() => {
      expect(screen.getByTestId(/recipe-photo/i)).toBeInTheDocument();
      expect(screen.getByTestId(/recipe-title/i)).toBeInTheDocument();
      expect(screen.getByTestId(/recipe-category/i)).toBeInTheDocument();
      expect(screen.getAllByTestId(/-ingredient-name-and-measure/i)).toHaveLength(4);
      expect(screen.getByTestId(/instructions/i)).toBeInTheDocument();
      expect(screen.getAllByTestId(/-recommendation-card/i)).toHaveLength(6);
      expect(screen.getAllByTestId(/-recommendation-title/i)).toHaveLength(6);
      expect(screen.getByTestId(/start-recipe-btn/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  test('Testa o botão de compartilhar', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => { history.push('/meals/53065'); });

    await waitFor(() => {
      expect(screen.getByTestId(/share-btn/i)).toBeInTheDocument();
      userEvent.click(screen.getByTestId(/share-btn/i));
    }, { timeout: 2000 });

    act(() => { history.push('/drinks/15288'); });

    await waitFor(() => {
      expect(screen.getByTestId(/share-btn/i)).toBeInTheDocument();
      userEvent.click(screen.getByTestId(/share-btn/i));
    }, { timeout: 2000 });

    act(() => { history.push('/meals/53065/in-progress'); });

    await waitFor(() => {
      expect(screen.getByTestId(/share-btn/i)).toBeInTheDocument();
      userEvent.click(screen.getByTestId(/share-btn/i));
    }, { timeout: 2000 });

    act(() => { history.push('/drinks/15997/in-progress'); });

    await waitFor(() => {
      expect(screen.getByTestId(/share-btn/i)).toBeInTheDocument();
      userEvent.click(screen.getByTestId(/share-btn/i));
    }, { timeout: 2000 });
  });

  test('Botão de start não deve aparecer, caso receita já exista no local storage', async () => {
    const { history } = renderWithRouter(<App />);

    localStorage.setItem('doneRecipes', JSON.stringify([{
      id: '15997',
      type: '',
      nationality: '',
      category: '',
      alcoholicOrNot: '',
      name: '',
      image: '',
      doneDate: '',
      tags: '',
    }]));

    act(() => {
      history.push('/drinks/15997');
    });

    await waitFor(() => {
      expect(screen.queryByTestId(/start-recipe-btn/i)).toBeNull();
    }, { timeout: 4000 });
  });

  test('Botão de start deve aparecer, caso receita não exista no local storage', async () => {
    const { history } = renderWithRouter(<App />);
    localStorage.clear();
    act(() => {
      history.push('/drinks/15997');
    });

    await waitFor(() => {
      expect(screen.getByTestId(/start-recipe-btn/i)).toBeInTheDocument();
      userEvent.click(screen.getByTestId(/start-recipe-btn/i));
    }, { timeout: 4000 });
  });

  test('Botão de Continue deve aparecer, caso receita exista no local storage como iniciada', async () => {
    const { history } = renderWithRouter(<App />);

    localStorage.setItem('inProgressRecipes', JSON.stringify({
      drinks: { 15997: [] }, meals: { 52772: [] },
    }));

    act(() => {
      history.push(meals);
    });

    await waitFor(() => {
      expect(screen.getByTestId(/start-recipe-btn/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  test('Botão de favorito deve estar preenchido caso exista a receita na chave de favoritos', async () => {
    const { history } = renderWithRouter(<App />);

    localStorage.setItem('favoriteRecipes', JSON.stringify([{
      id: '52772',
    }]));

    act(() => {
      history.push(meals);
    });

    await waitFor(() => {
      expect(screen.getByTestId(/favorite-btn/i)).toHaveAttribute('src', black);
      userEvent.click(screen.getByTestId(/favorite-btn/i));
      expect(screen.getByTestId(/favorite-btn/i)).toHaveAttribute('src', white);
      userEvent.click(screen.getByTestId(/favorite-btn/i));
      expect(screen.getByTestId(/favorite-btn/i)).toHaveAttribute('src', black);
    }, { timeout: 4000 });
  });

  test('Botão de favorito deve estar vazio caso não exista a receita na chave de favoritos', async () => {
    const { history } = renderWithRouter(<App />);
    localStorage.setItem('favoriteRecipes', JSON.stringify([{
      id: 'dsad',
    }]));
    act(() => {
      history.push(meals);
    });

    await waitFor(() => {
      expect(screen.getByTestId(/favorite-btn/i)).toHaveAttribute('src', white);
      userEvent.click(screen.getByTestId(/favorite-btn/i));
      expect(screen.getByTestId(/favorite-btn/i)).toHaveAttribute('src', black);
      userEvent.click(screen.getByTestId(/favorite-btn/i));
      expect(screen.getByTestId(/favorite-btn/i)).toHaveAttribute('src', white);
    }, { timeout: 4000 });
  });

  test('Ao clicar no botão de favoritar e não ouver a chave de favoritos, ela deve ser criada', async () => {
    const { history } = renderWithRouter(<App />);
    localStorage.clear();

    act(() => {
      history.push(meals);
    });

    await waitFor(() => {
      userEvent.dblClick(screen.getByTestId(/favorite-btn/i));
      expect(screen.getByTestId(/favorite-btn/i)).toHaveAttribute('src', 'whiteHeartIcon.svg');
      userEvent.click(screen.getByTestId(/share-btn/i));
    }, { timeout: 4000 });
  });

  // Componente RecipeInProgress
  test('Testa o botão de finalizar receita', async () => {
    const { history } = renderWithRouter(<App />);

    act(() => {
      history.push('/drinks/17222/in-progress');
    });

    await waitFor(() => {
      expect(screen.getByTestId(/finish-recipe-btn/i)).toBeInTheDocument();
      userEvent.click(screen.getAllByRole('checkbox')[0]);
      userEvent.click(screen.getAllByRole('checkbox')[1]);
      userEvent.click(screen.getAllByRole('checkbox')[2]);
      userEvent.click(screen.getAllByRole('checkbox')[3]);
      userEvent.click(screen.getByTestId(/favorite-btn/i));
      userEvent.click(screen.getByTestId(/finish-recipe-btn/i));
    }, { timeout: 2000 });
  });
});
