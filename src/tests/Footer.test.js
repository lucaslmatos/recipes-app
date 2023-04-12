import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import Footer from '../components/Footer';
import renderWithRouter from '../helpers/renderWithRouter';

describe('Testa o componente <Footer />', () => {
  it('Testa se o componente <Footer /> é renderizado', () => {
    render(<Footer />);
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });
  it('Testa se os dois botões são renderizados corretamente', () => {
    render(<Footer />);
    const drinkBtn = screen.getByTestId('drinks-bottom-btn');
    const mealBtn = screen.getByTestId('meals-bottom-btn');
    expect(drinkBtn).toBeInTheDocument();
    expect(mealBtn).toBeInTheDocument();
  });
  it('Testa se o botão de drinks redireciona para a página de bebidas', () => {
    const { getByTestId, history } = renderWithRouter(<Footer />);
    const drinkButton = getByTestId('drinks-bottom-btn');
    fireEvent.click(drinkButton);
    act(() => history.push('/drinks'));
    expect(history.location.pathname).toBe('/drinks');
  });

  it('Testa se o botão de meals redireciona para a página de refeições', () => {
    const { getByTestId, history } = renderWithRouter(<Footer />);
    const mealButton = getByTestId('meals-bottom-btn');
    fireEvent.click(mealButton);
    act(() => history.push('/meals'));
    expect(history.location.pathname).toBe('/meals');
  });
  // it('Testa se o botão de adicionar despesa redireciona para a página de tabela', () => {
  //   const { history } = renderWithRouterAndRedux(<App />);
  //   act(() => history.push('/tabela'));
  //   expect(history.location.pathname).toBe('/tabela');
  // });
});
