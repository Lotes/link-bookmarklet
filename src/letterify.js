(function() {
  function textNodesUnder(el){
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
  }

  function letterify(element) {
    var letters = [];
    textNodesUnder(element).forEach(function(textNode) {
      var text = textNode.data;
      var parent = textNode.parentNode;
      var span = document.createElement('span');
      var chars = text.split('');
      chars.forEach(function(ch) {
        var subSpan = document.createElement('span');
        subSpan.innerHTML = ch;  
        if(!/\s/.test(ch)) {
          letters.push({
            killed: false,
            element: subSpan
          });
        }
        span.appendChild(subSpan);
      });
      parent.replaceChild(span, textNode);
    });
    return letters;
  }
  
  module.exports = letterify;
})();