import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import axios from 'axios';
import CorpoTelaUm from '../CorpoTelaUm/index.jsx';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function get_token(username, password){
    await axios.post('https://backend-projeto3-8rpb.onrender.com/api/token/',{username, password})
    .then((response) => {
      const token = response.data.token;
      localStorage.setItem('token', token);
  })
}
 


  

  async function handleLogin(){
    // Limpa o estado de erro
    setError('');

    //Envio para o backend o usuario e senha para verificação
     await axios.post(' https://backend-projeto3-8rpb.onrender.com/api/users/', { username, password })
        .then(response => {
            // handle successful login
            get_token(username, password);
            console.log('Login successful');
            setIsLoggedIn(true); // Define o estado de login como verdadeiro
        })
        .catch(error => {
            // handle login error
            console.error('Login failed:', error);
            setError('Dados inválidos'); // Define a mensagem de erro
        });
  };

 
  // Redireciona para a próxima página se o login for bem-sucedido
  if (isLoggedIn) {
    return navigate('/principal');
  }

  return (
    <div className="login-container">
        <div class="mb-3">
            <h2 className='login-label'>Login</h2>
            <label for="username" class="form-label">Usuário</label>
            <input type="email" class="form-control" id="username" value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
            {error && <p className="error">{error}</p>} {/* Exibe a mensagem de erro */}
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <input type="password" class="form-control" id="password" value={password}
                        onChange={(e) => setPassword(e.target.value)}></input>
        </div>
            <button className="btn-edit btn btn-outline-dark " onClick={handleLogin}>Entrar</button>
            <p>Não tem uma conta? <Link to="/cadastro">Crie aqui</Link>.</p>
    </div>
  );
};

export default Login;
