(function() {  
  var CUCCO_COUNT = 5;
  var CUCCO_SPAWN_INTERVAL = 1000;

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
  var Cucco = require('./Cucco');
  
  function randomPosition() {
    var width = Math.max(window.innerWidth, document.body.clientWidth);
    var height = Math.max(window.innerHeight, document.body.clientHeight);
    return [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
  }
  
  onLoad(function() {
    //entities
    var letters = letterify(document.body);
    var effects = [];
    var items = [];
    var cuccos = [];
    var attackingCuccos = [];
    
    //prepare cuccos
    for(var cuccoIndex = 0; cuccoIndex < CUCCO_COUNT; cuccoIndex++) {
      var pos = randomPosition();
      cuccos.push(new Cucco(pos[0], pos[1]));
    }
    setInterval(function() {
      cuccos.forEach(function(cucco) {
        if(Math.random() > 0.6) {
          var pos = randomPosition();
          cucco.walkTo(pos[0], pos[1]);
        }
      });
    }, 500);
    
    var link = new Link(100, 100);
  
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
    
    var lastCuccoSpawnTime = 0;
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
        var attackBox = link.getAttackBox();
        if(attackBox) {
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
          
          cuccos.forEach(function(cucco) {
            if(cucco.getHitBox().intersectsRect(attackBox)) {
              cucco.hitBySword();
              link.hit();
            }
          });
        }
      }
      
      //items
      items.forEach(function(item) { 
        var attackBox = link.getAttackBox();
        var hitBox = link.getHitBox();
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
      
      //cucco
      var time = new Date().getTime();
      var width = Math.max(window.innerWidth, document.body.clientWidth);
      var height = Math.max(window.innerHeight, document.body.clientHeight);
      cuccos.forEach(function(cucco) {
        cucco.tick(collisionNet, link);  
        if(cucco.state === 'HELP' && time > lastCuccoSpawnTime + CUCCO_SPAWN_INTERVAL) {
          var sides = [
            ['X', width, 0],
            ['Y', 0, height],
            ['X', width, height],
            ['Y', width, height],
          ];
          var side = sides[Math.floor(Math.random() * 4)];
          var start = side[0] === 'X' 
            ? [Math.floor(Math.random(side[1])), side[2]]
            : [side[1], Math.floor(Math.random()*side[2])];
          var dest = [
            link.x + 10000*(link.x - start[0]),
            link.y + 10000*(link.y - start[1])
          ];
          attackingCuccos.push(new Cucco(start[0], start[1], dest));
          lastCuccoSpawnTime = time;
        }
      });
      
      attackingCuccos.forEach(function(cucco) {
        cucco.tick(collisionNet, link);
      });
      var newAttackingCuccos = [];
      attackingCuccos.forEach(function(cucco) {
        if(cucco.x >= 0 && cucco.x <= width && cucco.y>=0 && cucco.y <= height)
          newAttackingCuccos.push(cucco);
        else
          cucco.remove();
      });
      attackingCuccos = newAttackingCuccos;
    }, 100);
  });
})();