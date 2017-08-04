(function() {
  window.fromDom = function(domElement) {
    var all = document.querySelectorAll(domElement);
    return all.length > 1 ? all : document.querySelector(domElement);
  }
})();
