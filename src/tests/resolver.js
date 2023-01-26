/**
 * Файл взят по ссылке:
 * https://github.com/microsoft/accessibility-insights-web/pull/5421/commits/9ad4e618019298d82732d49d00aafb846fb6bac7#diff-c4f1d9c9d7b982f26536dbd6bf8c0804c1c0011fba8bc6df6e937363acfffa1f
 * Изменил имя пакета c "uuid" на "nanoid".
 * В купе со строчкой в конфигурационном файле "jest.config.json":
 * "resolver": "<rootDir>/src/tests/resolver.js",
 * решает вопрос с ошибкой "Jest encountered an unexpected token",
 * возникающей при запуске тестов.
 * Как вариант можно обойтись и без него, откатившись до версии jest 27
 * и при условии, что другие нужные пакеты (к примеру пакет "jest-environment-jsdom")
 * тоже будут обновлены до ~27 версии, всё должно работать без этого файла.
 * Более подробней смотри на сайте jest. Ключевые слова для поиска:
 * "jest from 27 to 28".
 */

module.exports = (path, options) => {
  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(path, {
    ...options,
    // Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
    packageFilter: pkg => {
      // This is a workaround for https://github.com/uuidjs/uuid/pull/616
      //
      // jest-environment-jsdom 28+ tries to use browser exports instead of default exports,
      // but uuid only offers an ESM browser export and not a CommonJS one. Jest does not yet
      // support ESM modules natively, so this causes a Jest error related to trying to parse
      // "export" syntax.
      //
      // This workaround prevents Jest from considering uuid's module-based exports at all;
      // it falls back to uuid's CommonJS+node "main" property.
      //
      // Once we're able to migrate our Jest config to ESM and a browser crypto
      // implementation is available for the browser+ESM version of uuid to use (eg, via
      // https://github.com/jsdom/jsdom/pull/3352 or a similar polyfill), this can go away.
      if (pkg.name === 'nanoid') {
        delete pkg['exports'];
        delete pkg['module'];
      }
      return pkg;
    }
  });
};
