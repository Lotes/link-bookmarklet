(function() {
  function Box(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  Box.prototype.intersectsRect = function(rect) {
    return !(
         this.x > rect.x + rect.width - 1 
      || rect.x > this.x + this.width - 1
      || this.y > rect.y + rect.height - 1
      || rect.y > this.y + this.height - 1
    );
  };
  function box(x, y, width, height) {
    return new Box(x,y,width,height);
  }
  module.exports = box;
})();