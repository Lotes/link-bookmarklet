(function() {
  var Sound = require('./Sound');

  /*
  var DICTIONARY = {
    SOUND: {
      MP3: 'dataURL...mp3',
      OGG: 'dataURL...audio/ogg'
    }
  };
  */

  function soundify(dictionary) {
    var result = {};
    for(var name in dictionary) {
      var sound = new Sound(name, dictionary[name].MP3, dictionary[name].OGG);
      result[name] = sound;
    }
    result.removeAll = function() {
      for(var name in dictionary)
        result[name].remove();
    };
    return result;
  }
  
  module.exports = soundify;
})();