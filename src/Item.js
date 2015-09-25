(function() {
  var box = require('./Box');

  var ITEM_LIFE_SPAN = 10000; //ms
  var ITEM_BLINK_TIME = 2000;
  var MILLISECONDS_PER_FRAME = 20; //ms
  var yBounce = [0, 1, 2, 4, 5, 6, 7, 7, 8, 9, 9, 9, 9, 9, 9, 8, 7, 7, 6, 5, 4, 2, 1, 0, 0, 1, 2, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0];
  var shadows = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0];
  
  function Item(x, y, typeName, imageData, collectSound) {
    var self = this;
    
    this.created = false;
    this.killed = false;
    this.type = typeName;
    this.x = x;
    this.y = y;
    this.collectSound = collectSound;
    
    this.visible = true;
    this.frameIndex = 0;
    this.hitBox = box(0, 0, 0, 0);
    
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = "absolute";
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    
    this.image = document.createElement('img');
    this.image.onload = function() {
      self.created = true;
      self.createdAt = new Date().getTime();
      self.tick();
    };
    this.image.src = imageData;
  }
  Item.prototype = {
    render: function() {
      if(!this.created || this.frameIndex >= yBounce.length)
        return; //no need to render after bouncing
      this.canvas.width = this.image.width;
      this.canvas.height = this.image.height * 3;
      this.canvas.style.left = Math.floor(this.x-this.canvas.width/2)+'px';
      this.canvas.style.top = Math.floor(this.y-this.canvas.height+this.canvas.width/2)+'px';
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var yOffset = yBounce[this.frameIndex];
      this.hitBox = box(Math.floor(this.x-this.canvas.width/2), this.y-this.image.height, this.image.width, this.image.height);
      if(shadows[this.frameIndex] === 1) {
        var radius = Math.floor(this.canvas.width/2);
        this.context.translate(radius, this.canvas.height-radius);
        this.context.scale(1, 0.5);
        this.context.beginPath();
        this.context.fillStyle = 'rgba(0,0,0,0.5)';
        this.context.arc(0, 0, radius, 0, 2*Math.PI, false);
        this.context.fill();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
      }
      this.context.drawImage(this.image, 0, 2*this.image.height - yOffset - this.canvas.width/2);
    },
    tick: function() {
      var time = new Date().getTime();
      this.frameIndex = Math.floor((time - this.createdAt)/MILLISECONDS_PER_FRAME);
      this.killed = time > this.createdAt + ITEM_LIFE_SPAN;
      if(this.killed)
        this.remove();
      else
        if(time > this.createdAt + ITEM_LIFE_SPAN - ITEM_BLINK_TIME) {
          this.visible = !this.visible;
          this.canvas.style.opacity = this.visible ? 1 : 0;
        }
      this.render();
    },
    remove: function() {
      if(this.canvas.parentNode !== null)
        this.canvas.parentNode.removeChild(this.canvas);
    },
    collect: function() {
      this.killed = true;
      this.remove();
      this.collectSound.play();
    }
  };

  module.exports = Item;
})();