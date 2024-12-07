// FooterTitle.js
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import footerstyles from './FooterStyles.js';

export default function FooterTitle(props) {
  return (
    <View style={footerstyles.container}>
      <View style={footerstyles.line}></View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={footerstyles.text_bold}>© 2023 AGRIBRASIL </Text>
        <Text style={footerstyles.text}>| CNPJ: 18.483.666/0001-03</Text>
      </View>
      <Text style={footerstyles.text}>R. Joaquim Floriano, 960 - 3° andar - Itaim Bibi, São Paulo - SP, 04534-004</Text>
    </View>
  );
}
