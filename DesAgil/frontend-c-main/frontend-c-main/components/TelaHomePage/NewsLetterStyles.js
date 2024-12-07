// NewsLetterStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import {

  evp,

  ehp,

  fsp

} from '../../globalStyles/globalStylesGD'
import {
  coresPadrao,
  fontesPadrao,
  espacamentoPadrao,
  

}from "../../globalStyles/globalStyle"
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


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const espacamento = 0.02;
const borderSize = 0.04;

const newsletterstyle = StyleSheet.create({
  newsletterContainer: {
    flexDirection: "column",
    borderWidth: windowWidth * borderSize,
    borderColor: '#FFF',
    padding: windowWidth * espacamento,
    position: 'relative',
    alignItems: "center"
  },

  newsletterText: {
    width: windowWidth * (1- 2*borderSize - 2*espacamento),
    fontSize: windowWidth *0.06,
    fontFamily: fontesPadrao.fonteTextoFormulario.fontFamily,
    fontWeight: fontesPadrao.fonteTextoFormulario.fontWeight,
    textAlign: 'center',
    color: '#183E1F',
    marginBottom: windowWidth * espacamento,
  },

  inputContainer: {
    width: windowWidth * (1- 2*borderSize - 2*espacamento),
    padding: windowWidth*espacamento,
    flexDirection: 'column', // Align text and input side by side
    alignItems: 'center', // Align items vertically in the center
  
  },

  input: {
    flex: 1, // Take remaining space
    fontSize: fontesPadrao.fonteLabel.fontSize,
    fontFamily: fontesPadrao.fonteLabel.fontFamily,
    fontWeight: fontesPadrao.fonteLabel.fontWeight,
    marginTop: espacamentoPadrao.espacoLabel.marginTop,
    marginLeft:  espacamentoPadrao.espacoLabel.marginLeft,
    color: coresPadrao.corInputTexto,
    borderWidth: 1,
    borderColor: coresPadrao.corInputBorda,
    padding: windowWidth * espacamento,
  },

  button: {
    flex:1,
    width: windowWidth * (1- 2*borderSize - 2*espacamento),
    fontSize: fontesPadrao.fonteTextoBotaoAcao.fontSize,
    fontFamily:fontesPadrao.fonteTextoBotaoAcao.fontFamily,
    fontWeight:fontesPadrao.fonteTextoBotaoAcao.fontWeight,
    backgroundColor: coresPadrao.corBackgroundBotaoAcao,  // Defina a cor de fundo do botão
    borderRadius: 0

  },

  text: {
    fontSize: windowWidth *0.04,
    color: coresPadrao.corTextoBotaoAcao,
    padding: windowWidth * espacamento,
  }
});

export default newsletterstyle;
