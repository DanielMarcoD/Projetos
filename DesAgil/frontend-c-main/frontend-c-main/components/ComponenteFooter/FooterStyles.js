// FooterStyles.js
import { StyleSheet, Dimensions } from "react-native";
import {

  evp,

  ehp,

  fsp

} from '../../globalStyles/globalStylesGD'

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const footerstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    left: 0,
    right: 0,
    marginVertical: windowHeight * 0.05, // 5% da altura da tela
  },
  line: {
    borderBottomWidth: 1,
    width: '100%',
    marginTop: 1*evp.V1,
    marginBottom: 1*evp.V1, // 2% da altura da tela
    borderColor: '#CD9705', // Mesma cor da fonte
  },
  text: {
    textAlign: 'center',
    fontSize: windowWidth * 0.025, // 2,5% da largura da tela
    color: '#CCCCCC', // Cor cinza claro
  },
  text_bold: {
    textAlign: 'center',
    fontSize: windowWidth * 0.025, // 2,5% da largura da tela
    fontWeight: 'bold', // Adiciona negrito
  },
});

export default footerstyles;
