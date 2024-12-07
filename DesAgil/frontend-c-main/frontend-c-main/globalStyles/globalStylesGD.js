import {Dimensions} from "react-native";


// --------- Variáveis de altura e largura --------- //


var { width, height } = Dimensions.get("window");

export const screenHeight = height;

export const screenWidth = width;


// --------- parâmetros responsivos de altura e largura --------- //


// -- espaçamento vertical padronizado -- //


export const evp = {
          
    V1: height * 0.01  // -- V1 representa 1% da altura total da tela-- //


}

// -- espaçamento horizontal padronizado -- //

export const ehp = {

    H1: width * 0.01   // -- H1 representa 1% da largura total da tela-- //

}

export const fsp = {

    F19: Math.round(Math.min(width, height) * 0.03200 + 14, 0),

    F18: Math.round(Math.min(width, height) * 0.03064 + 13, 0),

    F17: Math.round(Math.min(width, height) * 0.02928 + 12, 0),

    F16: Math.round(Math.min(width, height) * 0.02792 + 11, 0),

    F15: Math.round(Math.min(width, height) * 0.02656 + 10, 0),

    F14: Math.round(Math.min(width, height) * 0.0252 + 9.5, 0),

    F13: Math.round(Math.min(width, height) * 0.02384 + 9.0, 0),

    F12: Math.round(Math.min(width, height) * 0.02248 + 8.5, 0),

    F11: Math.round(Math.min(width, height) * 0.02112 + 8.0, 0),

    F10: Math.round(Math.min(width, height) * 0.01976 + 7.5, 0),

    F9: Math.round(Math.min(width, height) * 0.0184 + 7.0, 0),

    F8: Math.round(Math.min(width, height) * 0.01704 + 6.5, 0),

    F7: Math.round(Math.min(width, height) * 0.01568 + 6.0, 0),

    F6: Math.round(Math.min(width, height) * 0.01432 + 5.5, 0),

    F5: Math.round(Math.min(width, height) * 0.01296 + 4.0, 0),

    F4: Math.round(Math.min(width, height) * 0.0116 + 3.5, 0),

    F3: Math.round(Math.min(width, height) * 0.01024 + 3.0, 0),

    F2: Math.round(Math.min(width, height) * 0.00888 + 2.5, 0),

    F1: Math.round(Math.min(width, height) * 0.00752 + 2.0, 0),

}
