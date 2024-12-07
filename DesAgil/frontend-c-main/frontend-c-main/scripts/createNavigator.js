// NÃO É NECESSÁRIO ENTENDER OU MODIFICAR ESTE ARQUIVO.
// Se realmente acha necessário, pergunte ao professor.

const fs = require('fs');
const path = require('path');

const { split, mkdir } = require('../extras/create');

const COMPONENT_ROOT = 'components';

const argv = process.argv;

if (argv.length < 3) {
    throw new Error('Missing path');
}
if (argv.length < 4) {
    throw new Error('Missing type');
}
if (argv.length > 4) {
    throw new Error('Too many arguments');
}

const [dirname, basename] = split(argv[2]);

const context = {
    '{name}': basename,
    '{type}': argv[3].toLowerCase(),
};

switch (context['{type}']) {
    case 'stack':
        context['{base}'] = 'Stack';
        break;
    case 'drawer':
        context['{base}'] = 'Drawer';
        break;
    case 'material-top-tabs':
        context['{base}'] = 'MaterialTopTab';
        break;
    case 'material-bottom-tabs':
        context['{base}'] = 'MaterialBottomTab';
        break;
    default:
        throw new Error('Type must be stack, drawer, material-top-tabs, or material-bottom-tabs');
}

const name = `${basename}.js`;
let items;
if (dirname === '.') {
    items = [COMPONENT_ROOT, name];
} else {
    items = [COMPONENT_ROOT, dirname, name];
}
const outPath = items.join(path.sep);

const inPath = ['templates', 'Navigator.tpl'].join(path.sep);
const template = fs.readFileSync(inPath, { encoding: 'utf8' });
const regex = /(\{name\}|\{type\}|\{base\})/g;
const content = template.replace(regex, (match) => context[match]);

if (mkdir(outPath)) {
    fs.writeFileSync(outPath, content);
}
