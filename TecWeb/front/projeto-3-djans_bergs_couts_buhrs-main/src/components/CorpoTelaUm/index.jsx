import "./index.css";
import axios from "axios";
import { useState } from "react";
import { Link } from 'react-router-dom';
import AppBarFav from "../AppBarFav";
import PopUp from "../PopUp";

export default function CorpoTelaUm(props) {
    async function get_games(gameName) {
        try {
            // URL da API para buscar um jogo específico pelo nome
            const url = `https://api.rawg.io/api/games?key=64e9b22860784b7083f6dcab592047df&search=${encodeURIComponent(gameName)}`;
    
            // Faz a requisição GET usando Axios
            const response = await axios.get(url);
    
            // response.data já é um objeto JavaScript (parsed JSON)
            const data = response.data;
    
            if (data.results.length > 0) {
                console.log(`Game found: ${data.results[0].name}`);
                return data.results[0]; // Retorna o primeiro jogo encontrado
            } else {
                console.log('Game not found');
                return null; // Retorna nulo se nenhum jogo foi encontrado
            }
        } catch (error) {
            console.error('There was an error!', error);
        }
    }

    const [titulo, setTitulo] = useState("");
    const [popup, setPopup] = useState(0);
    const [popupText, setPopupText] = useState("");

    const config = {
        headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
        },
    };

    const addGame = async (event) => {
        event.preventDefault();

        const data = {
            "title": titulo
        };

        let gameData = await get_games(titulo);
        
        if (!gameData) {
            setPopupText("Jogo não encontrado");
            setPopup(1);
            return;
        }
        data.title = gameData.name;

        await axios
            .post("https://backend-projeto3-8rpb.onrender.com/api/games/", data, config)
            .then((response) => {
                setPopupText("Jogo adicionado aos favoritos!");
                setPopup(1);
                setTitulo("");
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    setPopupText("Jogo já adicionado aos favoritos!");
                    setPopup(1);
                    return;
                }
                console.error('Houve um erro!', error);
            });
    };

    const closePopup = () => {
        setPopup(0);
        setPopupText("");
    };

    return (
        <>
            <AppBarFav/>
            <div className="corpo">
                <p className="titulo">Encontre seus jogos favoritos!</p>
                
                <form onSubmit={addGame} className="sub_corpo">
                    <input className="input form-control-lg" type="text" placeholder="Digite o nome do game aqui" onChange={(event) => setTitulo(event.target.value)} value={titulo} />
                    <button className="btn-edit btn btn-outline-dark" type="submit">Adicionar</button>
                </form>
            
                <p className="texto2">Ou, descubra novos games com nosso buscador</p>
                <Link to="/buscador"><img src="lupa.png" alt="Logo" id="lupa"/> </Link>
            </div>

            {popup === 1 && <PopUp text={popupText} onClose={closePopup} />}
        </>
    );
}
