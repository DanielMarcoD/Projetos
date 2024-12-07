import { Dimensions } from 'react-native';


import { StyleSheet } from 'react-native';
import {
    evp,

    ehp,

    fsp,
} from '../../globalStyles/globalStylesGD'

const screenWidth = Dimensions.get('window').width; // Largura total da tela

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 2*evp.V1,
        paddingBottom: 3*evp.V1,
    },

    caixaBoasVindas: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopWidth: 0.2*evp.V1,
        borderBottomWidth: 0.2*evp.V1,
        borderColor: '#fff',
        marginHorizontal: 4*ehp.H1,
        paddingVertical: 1.5*evp.V1,
    },

    labelCategoriaPaginas: {
        marginLeft: 5*ehp.H1,
        color: '#fff',
        fontSize: fsp.F11,
        fontWeight: 'bold',
        paddingTop: 2*evp.V1,
    },  

    bottomButtonsContainer: {
        position: 'fixed',
        bottom: 0
    },

    drawerScreen: {
        backgroundColor: '#3F7E44',
        width: screenWidth*0.65, // Menu Lateral ocupa 65% da tela
    },

    drawerLabel: {
        color: '#ffffff',
    },
    
    logotipo: {
        height: 10,
        width: 10*(354/72),
    },

    closeBar: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    
    logo: {
        height: 8*evp.V1,
        width: 16.2*ehp.H1, //64*(247/268)
    },
    
    bemVindo: {
        fontSize: fsp.F10,
        paddingLeft: 3*ehp.H1,
        color: '#ffffff',
    },
    
    botao: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 6, 
    },
    
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },

    logins: {
        fontSize: fsp.F10,
        fontWeight:"bold", 
        color: '#ffffff',
        justifyContent:"center",
        alignItems:"center,"
    },
    algo: {
        flex: 1,
        justifyContent: 'center',
    }
})
