module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'mobx'],
    // fix react navigation: https://github.com/react-navigation/react-navigation/issues/5825#issuecomment-484776170
    plugins: ['@babel/plugin-transform-flow-strip-types']
  };
};
