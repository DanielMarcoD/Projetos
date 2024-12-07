// NÃO É NECESSÁRIO ENTENDER OU MODIFICAR ESTE ARQUIVO.
// Se realmente acha necessário, pergunte ao professor.

import React, { Fragment } from 'react';

function map(arr, callback) {
    return arr.map((value, index) => (
        <Fragment key={index}>
            {callback(value, index)}
        </Fragment>
    ));
}

export { map }
