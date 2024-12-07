// NÃO É NECESSÁRIO ENTENDER OU MODIFICAR ESTE ARQUIVO.
// Se realmente acha necessário, pergunte ao professor.

import React, { createContext, useState, useMemo } from 'react';

export default function createStateContext(defaultValue) {
    const Context = createContext();

    const OriginalProvider = Context.Provider;

    function Provider(props) {
        const [value, setValue] = useState(defaultValue);

        const state = useMemo(() => [value, setValue], [value]);

        return (
            <OriginalProvider
                {...props}
                value={state}
            >
                {props.children}
            </OriginalProvider>
        );
    }

    Context.Provider = Provider;

    return Context;
}
