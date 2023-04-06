import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';

describe('Testes: Página de Detalhes da Receita.', () => {
  test('Informações sobre receita de comidas aparecem na tela', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals/52772');
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
      history.push('/drinks/15997');
    });

    await waitFor(() => {
      expect(screen.getByTestId(/recipe-photo/i)).toBeInTheDocument();
      expect(screen.getByTestId(/recipe-title/i)).toBeInTheDocument();
      expect(screen.getByTestId(/recipe-category/i)).toBeInTheDocument();
      expect(screen.getAllByTestId(/-ingredient-name-and-measure/i)).toHaveLength(3);
      expect(screen.getByTestId(/instructions/i)).toBeInTheDocument();
      expect(screen.getAllByTestId(/-recommendation-card/i)).toHaveLength(6);
      expect(screen.getAllByTestId(/-recommendation-title/i)).toHaveLength(6);
      expect(screen.getByTestId(/start-recipe-btn/i)).toBeInTheDocument();
    }, { timeout: 4000 });
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
      history.push('/drinks/17222');
    });

    await waitFor(() => {
      expect(screen.getByTestId(/start-recipe-btn/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });
});
