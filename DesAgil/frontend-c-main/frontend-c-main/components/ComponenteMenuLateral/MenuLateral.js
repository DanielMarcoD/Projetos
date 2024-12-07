import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native'; // Importe o componente Image
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '../ComponenteHeader/Header.js';

import styles from './MenuLateralStyles.js'

import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from '../PlaceHolder.js';
import Home from "../Index.js";
import Notificacoes from '../PlaceHolder.js';
import CadastroProdutor from '../PlaceHolder.js';
import CadastroProdutorPropriedade from '../PlaceHolder.js';
import AlteraCadastroProdutor from '../PlaceHolder.js';
import AlterarCadastroProdutorPropriedade from '../PlaceHolder.js';
import PrecoLogistico from '../PlaceHolder.js';
import CadastrarAreaDeRetirada from '../PlaceHolder.js';
import CadastrarPorto from '../PlaceHolder.js';
import CadastrarPortoCaminhoLogistico from '../PlaceHolder.js';
import AlterarCadastroAreaDeRetirada from '../PlaceHolder.js';
import AlterarCadastroPorto from '../PlaceHolder.js';
import AlterarCadastroPortoCaminhoLogistico from '../PlaceHolder.js';
import CadastroEmbarques from '../PlaceHolder.js';
import CadastroNavio from '../PlaceHolder.js';
import AlteraCadastroNavio from '../PlaceHolder.js';
import AlterarCadastroEmbarque from '../PlaceHolder.js';
import SolicitacaoCotacao from '../PlaceHolder.js';
import RegistroOferta from '../PlaceHolder.js';
import ConsultaTransacoesOfertas from '../PlaceHolder.js';

import logotipo from '../../assets/logo.svg';
import { useNavigation } from '@react-navigation/native';
import AlterarSenha from '../PlaceHolder.js';

const Drawer = createDrawerNavigator();
const menuItemActiveColor = '#3F7E44';
// const menuItemActiveColor = '#0e482f';

export default function MenuLateral(props) {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState('');
  const [tiposUsuarios, setTiposUsuarios] = useState({
    '': {},
    'produtor': {
      'Login/Cadastro': {'Alterar senha':'Alterar Senha'},
      'Ofertas e Cotações': {'Cadastrar Oferta': 'Cadastrar Oferta', 'Solicitar Cotação on Line': 'Solicitar Cotacao', 'Consultar Basis Equivalente' : 'Consulta Transacoes'},
    },
    'comercial': {
      'Login/Cadastro': {'Alterar senha': 'Alterar Senha'},
      'Produtor' : {'Cadastrar Produtor': 'Cadastrar Produtor', 'Cadastrar Produtor/Propriedade': 'Cadastrar Produtor Propriedade', 'Alterar Cadastro Produtor': 'Alterar Cadastro Produtor', 'Alterar Cadastro Produtor/Propriedade': 'Alterar Cadastro Produtor Propriedade'},
      'Ofertas e Cotações': {'Cadastrar Oferta': 'Cadastrar Oferta', 'Solicitar Cotação on Line': 'Solicitar Cotacao', 'Consultar Basis Equivalente' : 'Consulta Transacoes'},
    },
    'logistica': {
      'Login/Cadastro': {'Alterar senha': 'Alterar Senha'},
      'Logística': {'Cadastrar Área de Retirada': 'Cadastrar Area de Retirada', 'Cadastrar Porto': 'Cadastrar Porto', 'Cadastrar Porto/Caminho Logístico' : 'Cadastrar Porto Caminho Logistico', 'Cadastrar Preço Logístico': 'Cadastrar Preco Logistico', 'Alterar Cadastro Área de Retirada': 'Alterar Cadastro Area de Retirada', 'Alterar Cadastro Porto': 'Alterar Cadastro Porto', 'Alterar Cadastro Caminho Logístico': 'Alterar Cadastro Caminho Logistico'},
    },
    'mesa': {
      'Login/Cadastro': {'Alterar senha': 'Alterar Senha'},
      'Navio / Embarque' : {'Cadastrar Navio': 'Cadastrar Navio', 'Cadastrar Embarque': 'Cadastrar Embarque', 'Alterar Cadastro Navio': 'Alterar Cadastro Navio', 'Alterar Cadastro Embarque': 'Alterar Cadastro Embarque'},
      'Ofertas e Cotações': {'Consultar Basis Equivalente' : 'Consulta Transacoes'},
    },
  })

  const CustomDrawerContent = (props) => {
    const { options, navigation } = props;

    const fecharDrawer = () => {
      navigation.dispatch(DrawerActions.closeDrawer());
    };

  

    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.closeBar}>
          <TouchableRipple onPress={fecharDrawer}>
            <Icon name="close" size={28} color={'white'} />
          </TouchableRipple>
        </View>
        <View style={styles.container}>
          <Image source={logotipo} style={styles.logo} /> 
        </View>

        {bemVindo()}

        <View style={{paddingTop: 25}}>
          {/* <DrawerItemList {...props} /> */}
          {Object.keys(tiposUsuarios[usuario]).map((categoria) => (
            <>
              <Text style={styles.labelCategoriaPaginas}>{categoria}</Text>
              {Object.keys(tiposUsuarios[usuario][categoria]).map((pagina) => (
                <DrawerItem
                  label={pagina}
                  onPress={() => navigation.navigate(tiposUsuarios[usuario][categoria][pagina])}
                  labelStyle={{color: '#fff', marginLeft: 10}}
                />
              ))}
            </>
          ))}
        </View>

        <View style={styles.bottomButtonsContainer}>
          <TouchableRipple style={styles.bottomButton} onPress={() => setUsuario('produtor')}>
          <View style={styles.buttonContent}>
              <Icon name="account-circle" size={20} color={'white'} />
              <Text style={styles.logins}>Sou Produtor</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple style={styles.bottomButton} onPress={() => setUsuario('comercial')}>
          <View style={styles.buttonContent}>
              <Icon name="account-circle" size={20} color={'white'} />
              <Text style={styles.logins}>Sou Comercial</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple style={styles.bottomButton} onPress={() => setUsuario('mesa')}>
          <View style={styles.buttonContent}>
              <Icon name="account-circle" size={20} color={'white'} />
              <Text style={styles.logins}>Sou Mesa</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple style={styles.bottomButton} onPress={() => setUsuario('logistica')}>
            <View style={styles.buttonContent}>
              <Icon name="account-circle" size={20} color={'white'} />
              <Text style={styles.logins}>Sou Logistica</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple style={styles.bottomButton} onPress={() => setUsuario('')}>
          <View style={styles.buttonContent}>
              <Icon name="logout-variant" size={20} color={'white'} />
              <Text style={styles.logins}>Deslogar</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple style={styles.bottomButton} onPress={() => setUsuario('')}>
          <View style={styles.buttonContent}>
              <Icon name="logout-variant" size={20} color={'white'} />
              <Text style={styles.logins}>Simular notificação</Text>
            </View>
          </TouchableRipple>
        </View>
      </DrawerContentScrollView>
    );
  };


  const verificaRota = () => {
    switch(usuario){
      default:
        return(
          <Drawer.Navigator initialRouteName="Home"screenOptions={{ header: Header, drawerStyle: styles.drawerScreen}} drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={Home} options={{ back: false, title: 'Home', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Login" component={Login} options={{ back: false, title: 'Login', drawerActiveBackgroundColor: menuItemActiveColor, drawerLabelStyle: styles.drawerLabel } } />
            <Drawer.Screen name="Alterar Senha" component={AlterarSenha} options={{ back: false, title: 'Alterar Senha', drawerActiveBackgroundColor: menuItemActiveColor, drawerLabelStyle: styles.drawerLabel } } />
            <Drawer.Screen name="Profile" component={Login} options={{ back: false, title: 'Perfil (Produtor)', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Notificacoes" component={Notificacoes} options={{ back: false, title: 'Notificacoes', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Cadastrar Oferta" component={RegistroOferta} options={{ back: false, title: 'Cadastrar Oferta', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Solicitar Cotacao" component={SolicitacaoCotacao} options={{ back: false, title: 'Solicitar Cotação on Line', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Consulta Transacoes" component={ConsultaTransacoesOfertas} options={{ back: false, title: 'Consultar Basis Equivalente', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Cadastrar Produtor" component={CadastroProdutor} options={{ back: false, title: 'Cadastrar Produtor', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Cadastrar Produtor Propriedade" component={CadastroProdutorPropriedade} options={{ back: false, title: 'Cadastrar Produtor/Propriedade', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Alterar Cadastro Produtor" component={AlteraCadastroProdutor} options={{ back: false, title: 'Alterar Cadastro Produtor', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Alterar Cadastro Produtor Propriedade" component={AlterarCadastroProdutorPropriedade} options={{ back: false, title: 'Alterar Cadastro Produtor/Propriedade', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Cadastrar Navio" component={CadastroNavio} options={{ back: false, title: 'Cadastrar Navio', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Cadastrar Embarque" component={CadastroEmbarques} options={{ back: false, title: 'Cadastrar Produtor/Propriedade', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Alterar Cadastro Navio" component={AlteraCadastroNavio} options={{ back: false, title: 'Alterar Cadastro Produtor', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Alterar Cadastro Embarque" component={AlterarCadastroEmbarque} options={{ back: false, title: 'Alterar Cadastro Produtor/Propriedade', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Cadastrar Area de Retirada" component={CadastrarAreaDeRetirada} options={{ back: false, title: 'Cadastrar Área de Retirada', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Cadastrar Porto" component={CadastrarPorto} options={{ back: false, title: 'Cadastrar Porto', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Cadastrar Porto Caminho Logistico" component={CadastrarPortoCaminhoLogistico} options={{ back: false, title: 'Cadastrar Porto/Caminho Logístico', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Cadastrar Preco Logistico" component={PrecoLogistico} options={{ back: false, title: 'Cadastrar Preço Logístico', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Alterar Cadastro Area de Retirada" component={AlterarCadastroAreaDeRetirada} options={{ back: false, title: 'Alterar Cadastro Área de Retirada', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Alterar Cadastro Porto" component={AlterarCadastroPorto} options={{ back: false, title: 'Alterar Cadastro Porto', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
            <Drawer.Screen name="Alterar Cadastro Caminho Logistico" component={AlterarCadastroPortoCaminhoLogistico} options={{ back: false, title: 'Alterar Cadastro Caminho Logístico', drawerActiveBackgroundColor: menuItemActiveColor,drawerLabelStyle: styles.drawerLabel }} />
          </Drawer.Navigator>
        );
    }
    }

const bemVindo = () => {
 switch (usuario) {
    case '':
      return(
        <TouchableRipple style={styles.bottomButton} onPress={() => navigation.navigate('Login')}> 
          <View style={styles.caixaBoasVindas}> 
            <Icon name="account-cowboy-hat" size={28} color={'white'} />
            <Text style={styles.bemVindo}>Faça Login</Text> 
          </View>
        </TouchableRipple>
      );
    default:
      return (
        <View style={styles.caixaBoasVindas}>
          <Icon name="account-cowboy-hat" size={28} color={'white'} />
          <Text style={styles.bemVindo}>Seja bem vindo {usuario}!</Text>
        </View>
      );
 }
  };

  return (
    <SafeAreaView style={{ flexGrow: 1, justifyContent: 'center' }}>
      {verificaRota()}
    </SafeAreaView>
  );
}