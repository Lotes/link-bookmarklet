(function() {
  var addEvent = require('./addEvent');
  var onLoad = require('./onLoad');
  
  var panel = null;
  var outstandingElements = [];
  
  function appendChild(element) {
    if(panel === null)
      outstandingElements.push(element);
    else
      panel.appendChild(element);
  }
  
  onLoad(function() {
    panel = document.createElement('div');
    function resize() {
      var width = Math.max(window.innerWidth, document.body.clientWidth);
      var height = Math.max(window.innerHeight, document.body.clientHeight);
      panel.style.width = width+'px';
      panel.style.height = height+'px';
    }
    addEvent(window, 'resize', resize);
    resize();
    panel.style.overflow = 'hidden';
    panel.style.position = 'absolute';
    panel.style.left = '0px';
    panel.style.top = '0px';
    outstandingElements.forEach(function(element) {
      panel.appendChild(element);
    });
    document.body.appendChild(panel);
  });
  
  module.exports = appendChild;
})();