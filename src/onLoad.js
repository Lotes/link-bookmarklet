(function() {
  var addEvent = require('./addEvent');
  function onLoad(callback) {
    if(document && document.readyState === "complete")
      callback();
    else
      addEvent(window, 'load', callback);
  }
  module.exports = onLoad;
})();