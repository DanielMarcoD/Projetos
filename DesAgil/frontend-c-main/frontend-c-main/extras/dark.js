// NÃO É NECESSÁRIO ENTENDER OU MODIFICAR ESTE ARQUIVO.
// Se realmente acha necessário, pergunte ao professor.

import { useContext } from 'react';

import createStateContext from './createStateContext';

import settings from '../settings.json';

const DarkContext = createStateContext(settings.dark);

function useDark() {
    return useContext(DarkContext);
}

export { DarkContext, useDark }
