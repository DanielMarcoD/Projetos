import {

    evp,

    ehp,

    fsp

} from './globalStylesGD'


// --------- Variáveis Globais de Cores --------- //
export const coresPadrao = {
    corFundoHeader: '#194020',
    
    corTextoPath: '#CD9705', //cor para o texto de qual página o usuário está Ex. "Home"
    
    corTituloPagina: '#183E1F', //cor para o texto do titulo da página

    corLabel: '#183E1F', //cor para o texto em cima do input

    corInputBackground: '#EFEFEF', //é a cor para o fundo de um input
    corInputBorda: '#ABBEAF', //é a cor pra borda de um input
    corInputTexto: '#434343', //é a cor para o texto de um input
    

    corBackgroundBotaoAcao: '#3F7E44', //pode ser um botão de envio, de salvar/prosseguir...
    corTextoBotaoAcao: '#FFFFFF',

    corSeparador: '#CD9705', //uma linha separadora de conteúdos


    corBackground: '#FFFFFF', //cor de fundo da tela

    corBordaTela: '#ABBEAF', //cor da borda da tela (Stroke)


}

// --------- Variáveis Globais de Fontes--------- //
export const fontesPadrao = {
    fonteTextoHeader: {  
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: fsp.F7,
    }, 

    fonteTextoBotaoAcao: {  
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: fsp.F9, 
    },

    fonteTextoAbaLateral: {  
        fontFamily: 'Inter',
        fontWeight: 'normal',
    },

    fonteTextoFormulario: {  
        fontFamily: 'Inter',
        fontWeight: 'normal',
    },

    fontePath: {  
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: fsp.F7, 
    }, //fonte para o texto de qual página o usuário está Ex. "Home"

    fonteTituloPagina: {  
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: fsp.F19, 
    }, //fonte para o texto de título da página

    fonteLabel: {  
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: fsp.F7,
    }, //fonte para o texto (label) do input
}

// --------- Variáveis Globais de Espaçamento--------- //
export const espacamentoPadrao = {
    espacoHeader: {
        marginTop: 2*evp.V1,
        marginLeft: 5*ehp.H1,
    }, //espaçamento entre do header

    espacoPath: {
        marginTop: 2*evp.V1, 
        marginLeft: 5*ehp.H1, 
    }, //espaçamento do path
    
    espacoTituloPagina: {
        marginTop: 2*evp.V1, 
        marginLeft: 5*ehp.H1, 
    }, //espaçamento do titulo da pagina

    espacoLabel: {
        marginTop: 2*evp.V1, 
        marginLeft: 5*ehp.H1,
    }, //espaçamento da label

    espacoInputUF: {
        marginRight: 5*ehp.H1,
        marginLeft: 5*ehp.H1,
    }, //espaçamento de um input UF

    espacoInputCEP: {
        marginLeft: 5*ehp.H1,
        marginRight: 5*ehp.H1,
    }, //espaçamento de um input para o CEP

    espacoSeparador: {
        marginTop: 1*evp.V1,
        marginBottom: 1*evp.V1,
    } //espaçamento de um separador e os conteúdos

} 

// import{espacamentoPadrao,...} from 'GlobalStyles/Style'