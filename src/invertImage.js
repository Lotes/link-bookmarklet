(function() {
  function invertImage(image) {
    //prepare
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    //transform
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    for(var i = 0; i < data.length; i += 4) {
      data[i + 0] = 255 - data[i + 0];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    context.putImageData(imageData, 0, 0);
    
    //return
    var result = document.createElement('img');
    result.src = canvas.toDataURL();
    return result;
  }
  module.exports = invertImage;
})();