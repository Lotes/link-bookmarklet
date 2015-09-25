(function() {
  function PageCollisionNet() {
    this.CELL_SIZE = 16;
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    this.rowCount = Math.ceil(height / this.CELL_SIZE)+1;
    this.columnCount = Math.ceil(width / this.CELL_SIZE)+1;
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
      x = Math.floor(x / this.CELL_SIZE);
      y = Math.floor(y / this.CELL_SIZE);
      return [
        Math.min(x, this.columnCount), 
        Math.min(y, this.rowCount)
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