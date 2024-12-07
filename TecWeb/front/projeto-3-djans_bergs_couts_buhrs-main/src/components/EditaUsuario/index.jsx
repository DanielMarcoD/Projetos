import React, { useState, useEffect } from 'react';
import './index.css';
import axios from 'axios';
import AppBarEdita from "../AppBarEdita";
import { useNavigate } from 'react-router-dom';

const EditUserInfo = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const config = {
    headers: {
      Authorization: `token ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    async function getUserInfo() {
      try {
        const response = await axios.get('https://backend-projeto3-8rpb.onrender.com/api/infos/', config);
        setName(response.data.username);
        setEmail(response.data.email);
        
      } catch (error) {
        console.error('There was an error!', error);
      }
    }
    getUserInfo();
  }, []);
  

  async function handleSave() {
    setIsSaved(true);
   

    await axios.post('https://backend-projeto3-8rpb.onrender.com/api/infos/', {"username":name,"password":password,"email":email},config)
      .then(response => {
        console.log('Atualização realizada com sucesso:', response.data);
      })
      .catch(error => {
        console.error('Erro ao atualizar usuário:', error);
      });
  
  };

  async function handleDelete() {

    setIsDeleted(true);
    await axios.delete('https://backend-projeto3-8rpb.onrender.com/api/infos/', config)
      .then(response => {
        console.log('Atualização realizada com sucesso:', response.data);
      })
      .catch(error => {
        console.error('Erro ao atualizar usuário:', error);
      });
  
  };

  if (isSaved) {
    return navigate('/principal');
  }
  if (isDeleted) {
    return navigate('/');
  }

  return (
  
    <>
    <AppBarEdita/>
    <div className="change-container">
    <div class="mb-3">
          <h2 className='info-label'>Informações do Usuário</h2>
            <label for="username" class="form-label">Nome de Usuário</label>
            <input type="text" class="form-control" id="username" value={name}
                        onChange={(e) => setName(e.target.value)}/>
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
      <button className='btn-salvar btn btn-outline-success' onClick={handleSave}>Salvar</button>
      <button className='btn-deletar btn btn-outline-danger' onClick={handleDelete}>Deletar</button>
    </div>
    </>
    
  );
};

export default EditUserInfo;
