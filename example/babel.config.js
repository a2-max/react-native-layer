const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

module.exports = function (api) {
  api.cache(true);

  const config = getConfig(
    {
      presets: ['babel-preset-expo'],
    },
    { root, pkg }
  );

  return {
    ...config,
    // expo 57 loads this without a filename, string patterns throw
    overrides: config.overrides?.map((override) => {
      const include = override.include;
      return typeof include === 'string'
        ? {
            ...override,
            include: (filename) =>
              filename != null && filename.startsWith(include),
          }
        : override;
    }),
    plugins: [...(config.plugins ?? []), 'react-native-reanimated/plugin'],
  };
};
