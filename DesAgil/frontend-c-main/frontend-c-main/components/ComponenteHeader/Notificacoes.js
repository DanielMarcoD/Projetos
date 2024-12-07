import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

import styles from './NotificacoesStyles';

import settings from '../../settings.json';

export default function Notificacoes(){
    return (
        <View style={styles.container}>
            <Text>Esta é a página de Notificacoes</Text>
        </View>
    );
}