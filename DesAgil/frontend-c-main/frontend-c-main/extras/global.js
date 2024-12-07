// NÃO É NECESSÁRIO ENTENDER OU MODIFICAR ESTE ARQUIVO.
// Se realmente acha necessário, pergunte ao professor.

import React, { useContext } from 'react';

import createStateContext from './createStateContext';

import globals from '../globals.json';

const Contexts = {};

function withGlobalStates(child) {
    for (const [name, defaultValue] of Object.entries(globals)) {
        const Context = createStateContext(defaultValue);
        child = (
            <Context.Provider>
                {child}
            </Context.Provider>
        );
        Contexts[name] = Context;
    }
    return child;
}

function useGlobalState(name) {
    if (!(name in Contexts)) {
        throw new Error(`Global state ${name} does not exist`);
    }
    return useContext(Contexts[name]);
}

export { withGlobalStates, useGlobalState };
