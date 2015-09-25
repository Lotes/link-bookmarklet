(function() {
  var onLoad = require('./onLoad');

  function Sound(name, mp3Data, oggData) {
    this.element = document.createElement('audio');
    
    if(mp3Data) {
      var mp3Source = document.createElement('source');
      mp3Source.type = 'audio/mpeg';
      mp3Source.src = mp3Data;
      this.element.appendChild(mp3Source);
    }

    if(oggData) {    
      var oggSource = document.createElement('source');
      oggSource.type = 'audio/ogg';
      oggSource.src = oggData;
      this.element.appendChild(oggSource);
    }

    var self = this;
    onLoad(function() {
      document.body.appendChild(self.element);
    });
  }
  
  Sound.prototype = {
    play: function() {
      this.element.pause();
      this.element.currentTime = 0;
      this.element.play();
    },
    remove: function() {
      if(this.element.parentNode!==null)
        this.element.parentNode.removeChild(this.element);
    }
  };
  
  module.exports = Sound;
})()