(function() {  
  var addEvent = require('./addEvent');
  var box = require('./Box');
  var letterify = require('./letterify');
  var onLoad = require('./onLoad');
  var Link = require('./Link');
  var DestroyEffect = require('./DestroyEffect');
  var PageCollisionNet = require('./PageCollisionNet');
  var Rupee = require('./Rupee');
  var injectStyle = require('./style');
  var Dialog = require('./Dialog');
  
  onLoad(function() {
    //entities
    var letters = letterify(document.body);
    var effects = [];
    var items = [];
    var link = new Link();
    
    //inject style (fonts)
    injectStyle();
    
    /*new Dialog('The called bookmarklet will install Link (The Legend Of Zelda) on the current page. Continue?', ['Yes', 'No'])
      .show(function(answer) {
        alert('Clicked: '+answer);
      });*/
    
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
            if(object.object.type !== 'letter')
              return;
            var letter = object.object;
            var hitBox = object.box;
            if(letter.killed)
              return;
            hit = true;
            letter.killed = true;
            letter.element.style.visibility = 'hidden';
            var effect = new DestroyEffect(hitBox.x + hitBox.width/2, hitBox.y + hitBox.height/2);
            effect.onAnimationEnded = function() {
              if(Math.random() > 0.9)
                items.push(new Rupee(effect.x, effect.y));
            };
            effects.push(effect);
          });
          letters = letters.filter(function(letter) { return !letter.killed; });
          if(hit) link.hit();
        }
      }
      
      //items
      items.forEach(function(item) { 
        var frame = link.getFrame();
        var attackBox = frame.attackbox;
        if(attackBox)
          attackBox = box(link.x-frame.cx+attackBox.x, link.y-frame.cy+attackBox.y, attackBox.width, attackBox.height);
        var hitBox = frame.hitbox;
        hitBox = box(link.x-frame.cx+hitBox.x, link.y-frame.cy+hitBox.y, hitBox.width, hitBox.height);
        if(item.hitBox.intersectsRect(hitBox) || (attackBox && item.hitBox.intersectsRect(attackBox)))
          item.collect();
        else
          item.tick(); 
      });
      items = items.filter(function(item) { return !item.killed; });
      
      //effects
      effects.forEach(function(effect) { effect.tick(); });
      var endedEffects = effects.filter(function(effect) { return effect.animationEnded; });
      effects = effects.filter(function(effect) { return !effect.animationEnded; });
    }, 100);
  });
})();