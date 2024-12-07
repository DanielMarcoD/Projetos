// Index.js
import React, { useState, useRef } from "react";
import { View, Image, ScrollView, Pressable, Dimensions, Text } from "react-native";
import styles from "./IndexStyles";
import { Linking } from "react-native";
import FooterTitle from "./ComponenteFooter/footer";
import NewsLetter from "./TelaHomePage/newsLetter"
import BlocoDeIcons from "./TelaHomePage/icons";
import HeaderTitle from "./ComponenteHeader/Header"

export default function Index(props) {
  const ScrollRef = useRef();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { width } = Dimensions.get("window");

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const images = [
    {
      id: 1,
      url: 'https://fastly.picsum.photos/id/820/200/200.jpg?hmac=dWVRjEMHD9jchbBs5tM-RR5xdXdBGAzIn1qI9WzpLs4',
    },
    {
      id: 2,
      url: 'https://fastly.picsum.photos/id/398/200/200.jpg?hmac=vfIjMAWfannZLe4HsdciIJxPkZh7v4XA2OpWglmHARg',
    },
    {
      id: 3,
      url: 'https://fastly.picsum.photos/id/233/200/200.jpg?hmac=WUkE2TwGJAJFsl1GTBP4NMm-wCxzkMLaTNkiTHCLHU0',
    },
    {
      id: 4,
      url: 'https://fastly.picsum.photos/id/278/200/200.jpg?hmac=ttIZUII9b-qTWIpyIHChMPIA802dHskBJGR2EAa-Ywc',
    },
  ];

  function scrollViewParaDireita() {
    if (currentImageIndex < images.length) {
      const nextImageIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextImageIndex);
      ScrollRef.current.scrollTo({
        x: nextImageIndex * (width * 0.8 + 2),
        y: 0,
        animated: true,
      });
    }
  }

  function scrollViewParaEsquerda() {
    if (currentImageIndex > 0) {
      const prevImageIndex = currentImageIndex - 1;
      setCurrentImageIndex(prevImageIndex);
      ScrollRef.current.scrollTo({
        x: prevImageIndex * (width * 0.8 + 2),
        y: 0,
        animated: true,
      });
    }
  }

  function onScroll(event) {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (width * 0.8 + 2));
    setCurrentImageIndex(index);
  }

  return (
    <>

    <View ><Text style = {styles.pathHomeStyle}>Home</Text></View>

    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        horizontal={true}
        onScroll={onScroll}
        scrollEventThrottle={100}
        ref={ScrollRef}
        pagingEnabled={true}
        snapToInterval={width * 0.8 + 2}
        decelerationRate="fast"
      >
        {images.map((image, index) => (
          <View key={index} style={styles.fotoContainer}>
            <Image source={{ uri: image.url }} style={styles.foto} />
          </View>
        ))}
      </ScrollView>

      <Pressable onPress={scrollViewParaDireita} style={styles.setaScrollParaDireita}>
        <Image source={require("../assets/setadireita.png")} style={styles.setaImagem} />
      </Pressable>

      <Pressable onPress={scrollViewParaEsquerda} style={styles.setaScrollParaEsquerda}>
        <Image source={require("../assets/setaesquerda.png")} style={styles.setaImagem} />
      </Pressable>

      
    </View>
    
    <NewsLetter/>

    <BlocoDeIcons/>

    {/* Bloco de Links Clicáveis */}
    <View style={styles.blocoLinks}>
        <Pressable onPress={() => handleLinkPress('https://www.agribrasil.net/a-empresa/')} style={styles.link}>
          <Text style={styles.linkText}>A Empresa |</Text>
        </Pressable>

        <Pressable onPress={() => handleLinkPress('https://www.agribrasil.net/governanca_/')} style={styles.link}>
          <Text style={styles.linkText}>Governança |</Text>
        </Pressable>

        <Pressable onPress={() => handleLinkPress('https://www.agribrasil.net/conduta/')} style={styles.link}>
          <Text style={styles.linkText}>Ética e conduta |</Text>
        </Pressable>

        <Pressable onPress={() => handleLinkPress('https://www.agribrasil.net/#gestao')} style={styles.link}>
          <Text style={styles.linkText}>Gestão</Text>
        </Pressable>
      </View>

      <View style={styles.blocoLinks2}>
        <Pressable onPress={() => handleLinkPress('https://www.agribrasil.net/contato/')} style={styles.link}>
          <Text style={styles.linkText}>Contato |</Text>
        </Pressable>

        <Pressable onPress={() => handleLinkPress('https://www.agribrasil.net/sustentabilidade/')} style={styles.link}>
          <Text style={styles.linkText}>Sustentabilidade |</Text>
        </Pressable>

        <Pressable onPress={() => handleLinkPress('https://www.agribrasil.net/home-page-ri/')} style={styles.link}>
          <Text style={styles.linkText}>Investidores |</Text>
        </Pressable>

        <Pressable onPress={() => handleLinkPress('https://agribrasil.gupy.io/')} style={styles.link}>
          <Text style={styles.linkText}>Trabalhe conosco</Text>
        </Pressable>
      </View>

    <FooterTitle />
   </> 
  );
}
