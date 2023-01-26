/**
 * Необходим для обхода ошибки, возникающей в процессе
 * jest тестирования
 */
module.exports = {
  process() {
    return {
      code: `module.exports = {};`,
    };
  },
};
