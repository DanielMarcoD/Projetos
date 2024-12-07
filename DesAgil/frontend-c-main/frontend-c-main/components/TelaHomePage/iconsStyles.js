// iconsStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const espacamento = 0.02;
const borderSize = 0.04;

const iconsStyles = StyleSheet.create({
  Container: {
    marginTop: -windowWidth*espacamento*5,
    width: windowWidth,

    height: windowWidth*0.3,
    //borderWidth: windowWidth * borderSize,
    //borderColor: "white",
    padding: windowWidth * espacamento,
    position: 'relative',

    //borderLeftWidth: windowWidth * borderSize,
    //borderRightWidth: windowWidth * borderSize,
    //borderBottomWidth: 1,
    //borderBottomColor: '#CCCCCC', // Mesma cor da fonte
    //borderTopWidth: 1,
    //borderTopColor: '#CCCCCC', // Mesma cor da fonte
    //borderLeftColor: "#006400",
    //borderRightColor: "#006400",
    //padding: windowWidth * espacamento,
    //position: 'relative',
    //height: windowHeight * 0.15

  },

  iconContainer: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
  },

  icon: {
    marginHorizontal: windowWidth*0.05, 
    width: windowWidth*0.08,
    height: windowWidth*0.08,
  },

});

export default iconsStyles;
