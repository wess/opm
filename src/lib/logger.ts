const Logger = {
  info(message: string) {
    console.log(`ℹ️  [INFO]: ${message}`);
  },

  success(message: string) {
    console.log(`✅  [SUCCESS]: ${message}`);
  },

  error(message: string) {
    console.log(`❌  [ERROR]: ${message}`);
  },

  warning(message: string) {
    console.log(`⚠️  [WARNING]: ${message}`);
  },

  debug(message: string) {
    console.log(`🐞  [DEBUG]: ${message}`);
  }
};

export default Logger;
