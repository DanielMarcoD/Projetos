// BlocoDeIcons.js
import React from 'react';
import {View, Image, Linking} from "react-native" 
import {TouchableRipple } from 'react-native-paper';
import iconsStyles from './iconsStyles';


export default function BlocoDeIcons(props) {
  const handleIconPress = (link) => {
    console.log(`Icon clicked. Link: ${link}`);
    Linking.openURL(link);
  };

  return (
    <View style={iconsStyles.Container}>
      <View style={iconsStyles.iconContainer}>
        {/* Icon 1 */}
        <TouchableRipple
        onPress={()=>handleIconPress('https://www.instagram.com/')}
        >
          <Image
          style={iconsStyles.icon} 
          source={require("../../assets/instagram.png")}/>
        </TouchableRipple>
        <TouchableRipple
        onPress={()=>handleIconPress('https://www.linkedin.com/company/agribrasil-comercio-e-exportacao/')}
        >
          <Image
          style={iconsStyles.icon} 
          source={require("../../assets/linkedin.png")}/>
        </TouchableRipple>
        <TouchableRipple
        onPress={()=>handleIconPress('https://www.facebook.com/')}
        >
          <Image
          style={iconsStyles.icon} 
          source={require("../../assets/facebook.png")}/>
        </TouchableRipple>
        <TouchableRipple
        onPress={()=>handleIconPress('https://www.twitter.com/')}
        >
          <Image
          style={iconsStyles.icon} 
          source={require("../../assets/twitter.png")}/>
        </TouchableRipple>
      </View>
    </View>
    
  );
}
