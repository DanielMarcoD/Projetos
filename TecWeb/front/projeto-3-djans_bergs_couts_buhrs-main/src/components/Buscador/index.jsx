import "./index.css";
import axios from "axios";
import { useState } from "react";
import AppBarFavBusca from '../AppBarFAvBusca';
import PopUp from "../PopUp";

export default function CorpoTelaUm(props) {
    // Estado para armazenar os jogos
    const [jogos, setJogos] = useState([]);
    // Estado para controlar a visibilidade da lista de jogos
    const [mostrarLista, setMostrarLista] = useState(false);
    // Estado para controlar o popup
    const [popup, setPopup] = useState(0);
    const [popupText, setPopupText] = useState("");

    const config = {
        headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
        },
    };

    // Função para pegar os jogos da API e atualizar o estado
    async function getGames() {
        try {
            let games = [];
            let i = Math.floor(Math.random() * 11);
            let j = i;
            while (i < j + 10) {
                const url = `https://api.rawg.io/api/games?key=64e9b22860784b7083f6dcab592047df&page=${i}`;
                const response = await axios.get(url);
                const data = response.data;
                games = games.concat(data.results);
                i++;
            }
            setJogos(games); // Atualiza o estado com os jogos obtidos
            setMostrarLista(true); // Define a visibilidade da lista como verdadeira após obter os jogos
        } catch (error) {
            console.error('Houve um erro!', error);
        }
    }

    // Função para salvar um jogo na base de dados
    async function salvarJogo(jogo) {
        const data = {
            "title": jogo.name // Supondo que o nome do jogo seja o título a ser salvo
        };

        try {
            await axios.post("https://backend-projeto3-8rpb.onrender.com/api/games/", data, config);
            setPopupText("Jogo adicionado aos favoritos!");
            setPopup(1);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setPopupText("Jogo já adicionado aos favoritos!");
                setPopup(1);
                return;
            }
            console.error('Houve um erro!', error);
        }
    }
    const closePopup = () => {
            setPopup(0);
            setPopupText("");
        };

    if (mostrarLista) {
        return (
            <>
                <AppBarFavBusca />
                <div className="container lista-jogos">
                    <div className="row">
                        {jogos.map(jogo => (
                            <div key={jogo.id} className="col-md-3 col-sm-6 mb-4">
                                <div className="jogo card h-100">
                                    <div className="d-flex justify-content-center align-items-center card-img-container">
                                        <img 
                                            src={jogo.background_image} 
                                            alt={jogo.name} 
                                            className="card-img-top jogoimg" 
                                            onClick={() => salvarJogo(jogo)} // Chama a função salvarJogo ao clicar na imagem
                                            style={{ cursor: 'pointer' }} // Define o cursor como ponteiro para indicar que é clicável
                                        />
                                    </div>
                                    <div className="card-body d-flex flex-column justify-content-end">
                                        <h5 className="card-title text-center">{jogo.name}</h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            {popup === 1 && <PopUp text={popupText} onClose={closePopup} />}
            </>
        );
    }

    return (
       <>
         <AppBarFavBusca />
        <div className="corpo_busca">
            <div className="titulo-btn">
                <p className="titulo_busca">Clique e descubra novos jogos!</p>
                <button className="btn-edit-2 btn btn-outline-dark" onClick={getGames}>Mostrar jogos</button>
            </div>
        </div>
       </>
    );
}
