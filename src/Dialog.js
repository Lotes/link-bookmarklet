(function() {
  var addEvent = require('./addEvent');

  function Dialog(content, answers) {
    answers = answers || [];
    
    this.overlay = document.createElement('div');
    this.overlay.style.visibility = 'hidden';
    this.overlay.style.position = 'absolute';
    this.overlay.style.left = '0px';
    this.overlay.style.top = '0px';
    this.overlay.style.width = '100%';
    this.overlay.style.height = '100%';
    this.overlay.style.textAlign = 'center';
    this.overlay.style.zIndex = 1000;
    this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    
    var window = document.createElement('div');
    window.innerHTML = content;
    window.style.backgroundColor = 'black';
    window.style.fontFamily = 'zelda';
    window.style.color = 'white';
    window.style.textAlign = 'left';
    window.style.fontSize = '10px';
    window.style.width = '200px';
    window.style.padding = '5px';
    window.style.margin = 'auto';
    
    var self = this;
    var answersDiv = document.createElement('div');
    answersDiv.style.textAlign = 'center';
    answers.forEach(function(answer) {
      var answerSpan = document.createElement('span');
      answerSpan.innerHTML = answer;
      answerSpan.style.margin = '0 5px 0 5px';
      answerSpan.style.cursor = 'pointer';
      answerSpan.style.fontWeight = 'bold';
      addEvent(answerSpan, 'click', function() {
        self.overlay.style.visibility = 'hidden';
        if(self.onCommit !== null)
          self.onCommit(answer);
      });
      answersDiv.appendChild(answerSpan);
    });
    window.appendChild(answersDiv);
    
    this.overlay.appendChild(window);
    
    document.body.appendChild(this.overlay);
  }
  Dialog.prototype = {
    show: function(resultCallback) {
      this.overlay.style.visibility = 'visible';
      this.onCommit = resultCallback;
    }
  };
  
  module.exports = Dialog;
})();