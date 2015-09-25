(function() {  
  var addEvent = require('./addEvent');
  var box = require('./Box');
  var letterify = require('./letterify');
  var onLoad = require('./onLoad');
  var Link = require('./Link');
  var DestroyEffect = require('./DestroyEffect');
  var PageCollisionNet = require('./PageCollisionNet');
  
  onLoad(function() {
    console.log('quak');
  
    //entities
    var letters = letterify(document.body);
    var effects = [];
    var items = [];
    var link = new Link();
    
    //input handling
    var keyToAction = { 32: 'ATTACK', 37: 'LEFT', 38: 'UP', 39: 'RIGHT', 40: 'DOWN' };
    var isDown = {
      ATTACK: false,
      LEFT: false,
      UP: false,
      RIGHT: false,
      DOWN: false
    };
    addEvent(document, 'keydown', function(event) { 
      if(event.which in keyToAction) { 
        var action = keyToAction[event.which];
        if(!isDown[action])
          link[action+'Down']();
        isDown[action] = true;
      }
    });
    addEvent(document, 'keyup', function(event) { 
      if(event.which in keyToAction) {
        var action = keyToAction[event.which];
        if(isDown[action])
          link[action+'Up']();
        isDown[action] = false;
      }
    });
    
    setInterval(function() {      
      //collision detection
      var collisionNet = new PageCollisionNet();
      letters.forEach(function(letter) {
        var rects = letter.element.getClientRects();
        for(var rectIndex=0; rectIndex<rects.length; rectIndex++) {
          var rect = rects[rectIndex];
          var hitBox = box(rect.x || rect.left, rect.y || rect.top, rect.width, rect.height);
          collisionNet.addObject(hitBox, letter);
        }
      });
      link.tick(collisionNet);
      if(link.isAttacking()) {
        var frame = link.getFrame();
        var attackBox = frame.attackbox;
        if(attackBox) {
          attackBox = box(link.x-frame.cx+attackBox.x, link.y-frame.cy+attackBox.y, attackBox.width, attackBox.height);
          var hit = false;
          var collisions = collisionNet.getObjects(attackBox);
          collisions.forEach(function(object) {
            var letter = object.object;
            var hitBox = object.box;
            if(letter.killed)
              return;
            hit = true;
            letter.killed = true;
            letter.element.style.visibility = 'hidden';
            effects.push(new DestroyEffect(hitBox.x + hitBox.width/2, hitBox.y + hitBox.height/2));
          });
          letters = letters.filter(function(letter) { return !letter.killed; });
          if(hit) link.hit();
        }
      }
      
      //effects
      effects.forEach(function(effect) { effect.tick(); });
      var endedEffects = effects.filter(function(effect) { return effect.animationEnded; });
      effects = effects.filter(function(effect) { return !effect.animationEnded; });
    }, 100);
  });
})();