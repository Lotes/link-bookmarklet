(function() {
  var addEvent = require('./addEvent');
  function onLoad(callback) {
    addEvent(window, 'load', callback);
  }
  module.exports = onLoad;
})();