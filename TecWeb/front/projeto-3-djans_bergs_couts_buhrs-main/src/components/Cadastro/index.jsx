import React, { useState } from 'react';
import './index.css';
import axios from 'axios';
import App from "../../../src/App.jsx";
import AppBar from "../AppBar/index.jsx"
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isCadstar, setIsCadastrar] = useState(false);
  const navigate = useNavigate();

  async function handleSignup (){
    // Limpa o estado de erro
    setError('');

    // Envio para o backend os dados do usuário para cadastro
    await axios.post('https://backend-projeto3-8rpb.onrender.com/api/users/', { username, password, email })
      .then(response => {
        // handle successful signup
        setIsCadastrar(true); // Define o estado de cadastro como verdadeiro
        console.log('Cadastro realizado com sucesso:', response.data);
      })
      .catch(error => {
        // handle signup error
        console.error('Erro ao cadastrar usuário:', error);
        setError('Erro ao cadastrar usuário. Por favor, tente novamente.'); // Define a mensagem de erro
      });
  };
  if (isCadstar) {
    return navigate('/');
  }
  return (
 
    <>
      <AppBar/>
      <div className="signup-container">
        <div class="mb-3">
          <h2 className='cadastro-label'>Cadastro de Usuário</h2>
            <label for="username" class="form-label">Nome de Usuário</label>
            <input type="username" class="form-control" id="username" value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
            {error && <p className="error">{error}</p>} {/* Exibe a mensagem de erro */}
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">E-mail</label>
            <input type="email" class="form-control" id="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <input type="password" class="form-control" id="password" value={password}
                        onChange={(e) => setPassword(e.target.value)}></input>
        </div>
            <button className="btn-edit btn btn-outline-dark " onClick={handleSignup}>Cadastrar</button>
      </div>
      
    </>
  );
    
    
    
};

export default Signup;
