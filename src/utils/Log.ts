export default class Log {

  static _(type, log) {
    __DEV__ && console.log((new Date()).toLocaleString(), ` ${type} :: `, log);
  }

  static i(log) {
    Log._('INFO', log);
  }

  static e(log) {
    Log._('ERROR', log);
  }

}
