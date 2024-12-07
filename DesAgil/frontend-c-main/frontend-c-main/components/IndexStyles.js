// IndexStyles.js
import { StyleSheet, Dimensions } from "react-native";

import {
  evp, 
  ehp,
  fsp,
} from "../globalStyles/globalStylesGD"
import {
  coresPadrao,
  fontesPadrao,
  espacamentoPadrao,
  

}from "../globalStyles/globalStyle"

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const espacamento = 0.02;
const borderSize = 0.04;
const arrowSize = 0.15;
  // Outros estilos...
const {
  corTextoPath,
  corTituloPagina,
  corLabel,
  corInputBackground,
  corInputBorda,
  corInputTexto,
  corBackgroundBotaoAcao,
  corTextoBotaoAcao,
  corSeparador,
  corBackground,
  corBordaTela,
} = coresPadrao;

const {
  fonteTextoHeader,
  fonteTextoBotaoAcao,
  fonteTextoAbaLateral,
  fonteTextoFormulario,
  fontePath,
  fonteTituloPagina,
  fonteLabel,
} = fontesPadrao;

const {
  espacoHeader,
  espacoPath,
  espacoTituloPagina,
  espacoLabel,
  espacoInputUF,
  espacoInputCEP,
  espacoSeparador,
} = espacamentoPadrao;  

 

  // Outros estilos...


const styles = StyleSheet.create({
  container1: {
    height: windowHeight *0.05,
    justifyContent: "center",
    alignItems: "center",
    borderColor: '#ABBEAF'
    
  },

  pathHomeStyle: {
    fontWeight: fontePath.fontWeight,
    fontSize: fontePath.fontSize,
    fontFamily: fontePath.fontFamily,
    color: corTextoPath,
    marginTop: espacoPath.marginTop,
    marginLeft: espacoPath.marginLeft,
    // Outros estilos que você deseja adicionar
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
  
    
  },
  scrollView: {
    flexDirection: "row",
    width: windowWidth,
  },
  fotoContainer: {
    width: windowWidth,
    borderWidth: windowWidth * borderSize,
    borderColor: "#FFF",
    padding: windowWidth * espacamento,
    position: 'relative',
   
  },
  foto: {
    width: windowWidth * (1- 2*borderSize - 2*espacamento),
    height:  windowWidth * (1- 2*borderSize - 2*espacamento),
    resizeMode: "cover",
  },
  setaScrollParaDireita: {
    // width:( windowWidth - 2*espacamento)/2  - (windowWidth * (1- 2*borderSize - 2*espacamento) * arrowSize)/2, // Ajusta a largura para 25% da largura da tela
    // height:( windowWidth - 2*espacamento)/2  - (windowWidth * (1- 2*borderSize - 2*espacamento) * arrowSize)/2,
    position: 'absolute',
    right: 0.5*espacamento , // Ajusta a distância da direita para 15% da largura da tela
    top: ( windowWidth - 2*espacamento)/2  - (windowWidth * (1- 2*borderSize - 2*espacamento) * arrowSize)/2,
  },
  setaScrollParaEsquerda: {
    // width: windowWidth * 0.25, // Ajusta a largura para 25% da largura da tela
    // height: windowHeight * 0.3,
    position: 'absolute',
    left: 0.5 * espacamento, // Ajusta a distância da esquerda para 2% da largura da tela
    top: ( windowWidth - 2*espacamento)/2  - (windowWidth * (1- 2*borderSize - 2*espacamento) * arrowSize)/2,
  },
  setaImagem: {
    width: windowWidth * (1- 2*borderSize - 2*espacamento) * arrowSize,
    height:  windowWidth * (1- 2*borderSize - 2*espacamento) * arrowSize,
  },
  linkText: {
    textAlign: 'center',
    fontSize: windowWidth * 0.03, // 2,5% da largura da tela
    color: 'black', // Cor cinza claro
    padding: windowWidth * espacamento*0.5,
  },
  blocoLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    left: 0,
    right: 0
  },
  blocoLinks2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    left: 0,
    right: 0,
  },

  
});

export default styles;

