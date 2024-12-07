import { StyleSheet } from 'react-native';

import {
    evp,

    ehp,

    fsp,
} from '../../globalStyles/globalStylesGD'

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 2.5*evp.V1,
        paddingRight: 7*ehp.H1,
        paddingBottom: 2.3*evp.V1,
        paddingLeft: 7*ehp.H1,
        backgroundColor: '#0e482f',
        shadowColor: '#000000',
        shadowOpacity: .5,
        shadowRadius: 5,
    },
    notificationsIcon: {
        height: 3.2*evp.V1,
        width: 3.2*evp.V1,
    },
    menuIcon: {
        height: 3.2*evp.V1,
        width: (50/38)*3.2*evp.V1,
    },
    logotipo: {
        height: 8*evp.V1,
        width: (247/268)*8*evp.V1,
    },

    badgeContainer: {
        position: 'absolute',
        top: -5,
        right: -7,
        backgroundColor: 'red', 
        borderRadius: 10, 
        justifyContent: 'center',
        alignItems: 'center',
        width: 15,
        height: 15,
    }, // não está sendo utilizado ainda

    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    }, // não está sendo utilizado ainda

    customNotificationButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: '#e74c3c', 
    }, // não está sendo utilizado ainda
    
    customNotificationButtonText: {
        color: 'white', 
        fontWeight: 'bold',
    } // não está sendo utilizado ainda
})