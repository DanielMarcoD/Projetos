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
if (argv.length > 3) {
    throw new Error('Too many arguments');
}

const [dirname, basename] = split(argv[2]);

const context = {
    '{name}': basename,
};

let name, items, outName, inName;

name = `${basename}.js`;
if (dirname === '.') {
    items = [COMPONENT_ROOT, name];
} else {
    items = [COMPONENT_ROOT, dirname, name];
}
outName = items.join(path.sep);

inName = ['templates', 'Component.tpl'].join(path.sep);
const template = fs.readFileSync(inName, { encoding: 'utf8' });
const regex = /(\{name\})/g;
const content = template.replace(regex, (match) => context[match]);

if (mkdir(outName)) {
    fs.writeFileSync(outName, content);
}

name = `${basename}Styles.js`;
if (dirname === '.') {
    items = [COMPONENT_ROOT, name];
} else {
    items = [COMPONENT_ROOT, dirname, name];
}
outName = items.join(path.sep);

inName = ['templates', 'Styles.js'].join(path.sep);

if (mkdir(outName)) {
    fs.copyFileSync(inName, outName);
}
