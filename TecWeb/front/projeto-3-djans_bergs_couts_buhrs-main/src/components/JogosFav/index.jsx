import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./index.css";
import AppBarFavBusca from '../AppBarFAvBusca';
import axios from 'axios';


const JogosFav = () => {
    const config = {
        headers: {
          Authorization: `token ${localStorage.getItem("token")}`,
        },
      };
    // Pegando os jogos favoritos da base de dados
    const [games, setGames] = useState([]);
    useEffect(() => {
        axios.get("https://backend-projeto3-8rpb.onrender.com/api/games/",config)
            .then((response) => setGames(response.data))
            .catch((error) => console.error('Error fetching games:', error));
    }, []);

    // Criando uma função para deletar um jogo
    const deleteGame = async (id) => {
        try {
            await axios.delete(`https://backend-projeto3-8rpb.onrender.com/api/games/${id}/`,config);
            setGames(games.filter((game) => game.id !== id));
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    };
    
    return (
        <>
            <AppBarFavBusca />
                <div className='container-fav'>
                    <h1 className='Titulo'>Jogos Favoritos</h1>
                    {games.length > 0 ? (
                        <ul>
                            {/* Adicionando o botão para deletar o jogo */}
                            {games.map((game) => (
                                <div className='jogos'>
                                    <li className="jogos_list" key={game.id}>
                                        {game.title}
                                        <button className='btn-delete btn btn-outline-danger' onClick={() => deleteGame(game.id)}>Delete</button>
                                    </li>
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p className='paragraf'>Ainda não há jogos favoritos</p>
                    )}
                </div>
        </>
    );
};

export default JogosFav;
