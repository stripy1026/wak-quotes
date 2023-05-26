function autoplayUnlock(playElement) {
  var ctx = new (window.AudioContext || window.webkitAudioContext)();
  return new Promise(function (resolve, reject) {
      if (true) {
          let elements = [document, document.getElementById('canvas'), playElement];
          let events = ['keydown', 'mousedown', 'touchstart', 'touchend'];
          let unlock = function unlock() {
              ctx.resume()
                  .then(function () {
                      events.forEach(function(event) {
                          elements.forEach(function(elem) {
                              elem.removeEventListener(event, unlock);
                          });
                      });