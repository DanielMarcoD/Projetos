// NÃO É NECESSÁRIO ENTENDER OU MODIFICAR ESTE ARQUIVO.
// Se realmente acha necessário, pergunte ao professor.

import 'react-native-gesture-handler';

import merge from 'deepmerge';

import React from 'react';
import { LogBox, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme as PaperLightTheme, MD3DarkTheme as PaperDarkTheme, adaptNavigationTheme, Text } from 'react-native-paper';
import { NavigationContainer, DefaultTheme as NavigationLightTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { pt, registerTranslation } from 'react-native-paper-dates';

import CustomLightTheme from './themes/Light';
import CustomDarkTheme from './themes/Dark';

import { DarkContext, useDark } from './extras/dark';
import { withGlobalStates } from './extras/global';

import Index from './components/Index';
import MenuLateral from "./components/ComponenteMenuLateral/MenuLateral";

LogBox.ignoreAllLogs();

const { LightTheme, DarkTheme } = adaptNavigationTheme({ reactNavigationLight: NavigationLightTheme, reactNavigationDark: NavigationDarkTheme });

const CombinedLightTheme = merge.all([PaperLightTheme, LightTheme, CustomLightTheme]);
const CombinedDarkTheme = merge.all([PaperDarkTheme, DarkTheme, CustomDarkTheme]);

registerTranslation('pt', pt);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>ERRO DE JAVASCRIPT</Text>
          <Text>Se você está testando na web,</Text>
          <Text style={{ marginBottom: 10 }}>veja o console do Google Chrome.</Text>
          <Text>Se você está testando no celular,</Text>
          <Text style={{ marginBottom: 10 }}>veja o terminal do npx expo start.</Text>
          <Text style={{ fontStyle: 'italic' }}>Sempre leia erros de cima para baixo!</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [dark,] = useDark();

  const theme = dark ? CombinedDarkTheme : CombinedLightTheme;

  return withGlobalStates(
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <MenuLateral />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default () => (
  <ErrorBoundary>
    <DarkContext.Provider>
      <App />
    </DarkContext.Provider>
  </ErrorBoundary>
)
