import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import newsletterstyle from './NewsLetterStyles.js';
import { View, TextInput } from 'react-native';
import axios from 'axios';
import settings from '../../settings.json';
import { Button as PaperButton } from 'react-native-paper';

export default function NewsLetter(props) {
  const [email, setEmail] = useState('');

  const put = async () => {
    try {
      await axios.put(settings.url + '/homepage', {
        email: email,
      });
    } catch (error) {
      console.log(error);
    }

    
  };

  return (
    <>
      <View style={newsletterstyle.newsletterContainer}>
        <Text style={newsletterstyle.newsletterText}>
          Inscreva-se na nossa newsletter e receba novidades da Agribrasil
        </Text>
        <View style={newsletterstyle.inputContainer}>
          <TextInput
            style={newsletterstyle.input}
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={(text) => setEmail(text)}
          TextInput/>
        </View>
        <PaperButton
          style={newsletterstyle.button}
          onPress={put}
          mode="contained"
        >
          <Text style={newsletterstyle.text}>Inscrever-se</Text>
        </PaperButton>
      </View>
    </>
  );
}

