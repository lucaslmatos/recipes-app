import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function Login() {
  // Declaração dos estados e variáveis úteis.
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [bttnDisabled, setButton] = useState({
    disabled: true,
  });
  const passwMin = 6;
  const history = useHistory();

  // Função que irá conferir as condições de login e habilitar o botão de Entrar.
  useEffect(() => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-_]+\.[A-Za-z]{2,}$/;
    const validaty = user.password.length > passwMin && regex.test(user.email);
    setButton({
      disabled: !validaty,
    });
  }, [user.password, user.email]);

  // Funsção para lidar com os campos de digitação do formulário.
  function handleChange({ target: { name, value } }) {
    setUser({
      ...user,
      [name]: value,
    });
  }

  // Função para lidar com o botão de Entrar.
  function handleClick() {
    localStorage.setItem('user', JSON.stringify({ email: user.email }));
    history.push('/meals');
  }

  return (
    <>
      {/* Estrutura do formulário */}
      <header className="App-header">
        <p>APP de Receitas</p>
      </header>
      <form onSubmit={ handleClick }>
        <label>
          Email
          <input
            name="email"
            type="email"
            data-testid="email-input"
            value={ user.email }
            onChange={ handleChange }
          />
        </label>
        <label>
          Senha
          <input
            name="password"
            type="password"
            data-testid="password-input"
            value={ user.password }
            onChange={ handleChange }
          />
        </label>
        <button
          type="submit"
          disabled={ bttnDisabled.disabled }
          data-testid="login-submit-btn"
        >
          Enter
        </button>
      </form>
    </>
  );
}

Login.propTypes = {}.isRequired;
