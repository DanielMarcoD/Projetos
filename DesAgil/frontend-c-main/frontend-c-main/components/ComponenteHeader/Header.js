import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

import styles from './HeaderStyles.js';
import menu from '../../assets/menu-icon.png';
import logotipo from '../../assets/logo.svg';
import notificationsIcon from '../../assets/notifications-icon.png';
import axios from 'axios';

import settings from '../../settings.json';

export default function HeaderTitle(props) {
  const { navigation } = props;
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState([]);
  const [numeroNotificacoes, setNumeroNotificacoes] = useState([]);


  const menuPress = () => {
    console.log("Clicou no menu lateral");
    navigation.openDrawer();
  };

  const titlePress = () => {
    console.log("Clicou no ícone da empresa");
    navigation.navigate('Home');
  };

  const notificationPress = async () => {
    console.log("Clicou nas notificações");
    navigation.navigate("Notificacoes");
  };

  useEffect(() => {
    async function get(){
        try{
            const response = await axios.get(settings.url + "/notificacoes");
            setNotificacoesNaoLidas(response.data);
        }
        catch(error){
            console.log(error);
        }
    } 
    get();
  }, []);

  const simulateNotificationPress = async () => {
    // Simula uma nova notificação
    // setNotificacoesNaoLidas(notificacoesNaoLidas + 1);

    try {
      await axios.post(settings.url + "/notificacoes", {
        "mensagem": "teste",
        "mensagem": "teste2"
      })
    }catch(error) {
      console.log(error)
    }
  };

  return (
    <View style={styles.container}>
      <TouchableRipple onPress={menuPress}>
        <Image style={styles.menuIcon} source={menu} />
      </TouchableRipple>
      <TouchableRipple onPress={titlePress}>
        <Image style={styles.logotipo} source={logotipo} />
      </TouchableRipple>
      {/* <TouchableRipple onPress={simulateNotificationPress}>
          <View style={styles.customNotificationButton}>
            <Text style={styles.customNotificationButtonText}>SIMULAR</Text>
          </View>
        </TouchableRipple> */}
      <TouchableRipple onPress={notificationPress}>
        <View>
          <Image style={styles.notificationsIcon} source={notificationsIcon} />
          {notificacoesNaoLidas.length > 0 && (
            <View style={styles.badgeContainer}>
              {/* <Text style={styles.badgeText}>{notificacoesNaoLidas.length}</Text> */}
            </View>
          )}
        </View>
      </TouchableRipple>
    </View>
  );
}