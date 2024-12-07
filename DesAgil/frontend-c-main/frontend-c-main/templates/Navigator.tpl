import React from 'react';
import { create{base}Navigator } from '@react-navigation/{type}';

import XXX from './XXX';
import YYY from './YYY';

const {base} = create{base}Navigator();

export default function {name}(props) {
    return (
        <{base}.Navigator initialRouteName="">
            <{base}.Screen name="XXX" component={XXX} />
            <{base}.Screen name="YYY" component={YYY} />
        </{base}.Navigator>
    );
}
