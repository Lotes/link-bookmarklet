(function() {
  var box = require('./Box');

  function PageCollisionNet() {
    this.CELL_SIZE = 16;
    var width = Math.max(document.body.clientWidth, window.innerWidth);
    var height = Math.max(document.body.clientHeight, window.innerHeight);
    this.rowCount = Math.ceil(height / this.CELL_SIZE)+2;
    this.columnCount = Math.ceil(width / this.CELL_SIZE)+2;
    this.rows = [];
    for(var rowIndex=0; rowIndex<this.rowCount; rowIndex++) {
      var row = [];
      for(var columnIndex=0; columnIndex<this.columnCount; columnIndex++)
        row.push({
          row: rowIndex,
          column: columnIndex,
          objects: []
        });
      this.rows.push(row);
    }
    this.addObject(box(-10, -10, width+20, 10), { type: 'wall' });
    this.addObject(box(-10, +height, width+20, 10), { type: 'wall' });
    this.addObject(box(-10, -10, 10, height+20), { type: 'wall' });
    this.addObject(box(+width, -10, 10, height+20), { type: 'wall' });
  }
  PageCollisionNet.prototype = {
    getObjects: function(box) {
      var result = [];
      var fromCell = this.getCellCoordinates(box.x, box.y);
      var toCell = this.getCellCoordinates(box.x+box.width-1, box.y+box.height-1);
      for(var rowIndex=fromCell[1]; rowIndex<=toCell[1]; rowIndex++) {
        var row = this.rows[rowIndex];
        for(var columnIndex=fromCell[0]; columnIndex<=toCell[0]; columnIndex++) {
          var objects = row[columnIndex].objects;
          for(var objectIndex=0; objectIndex<objects.length; objectIndex++)
            if(box.intersectsRect(objects[objectIndex].box))
              result.push(objects[objectIndex]);
        }
      }
      return result;
    },
    getCellCoordinates: function(x, y) {
      x = Math.floor(x / this.CELL_SIZE+1);
      y = Math.floor(y / this.CELL_SIZE+1);
      return [
        Math.max(Math.min(x, this.columnCount), 0), 
        Math.max(Math.min(y, this.rowCount), 0)
      ];
    },
    addObject: function(box, object) {
      var fromCell = this.getCellCoordinates(box.x, box.y);
      var toCell = this.getCellCoordinates(box.x+box.width-1, box.y+box.height-1);
      for(var rowIndex=fromCell[1]; rowIndex<=toCell[1]; rowIndex++) {
        var row = this.rows[rowIndex];
        for(var columnIndex=fromCell[0]; columnIndex<=toCell[0]; columnIndex++) {
          var cell = row[columnIndex];
          cell['objects'].push({
            box: box, 
            object: object
          });
        }
      }
    }
  };

  module.exports = PageCollisionNet;
})();