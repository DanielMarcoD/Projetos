// NÃO É NECESSÁRIO ENTENDER OU MODIFICAR ESTE ARQUIVO.
// Se realmente acha necessário, pergunte ao professor.

module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: ['react-native-reanimated/plugin'],
    };
};
