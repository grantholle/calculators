define(['app/config'], function(config) {

  // config dat mug.
  requirejs.config(config.requirejs);

  var toRequire = ['app/sliders', 'app/calculator', 'app/app', 'jquery'];

  require(toRequire, function (sliders, calc, app) {
    document.addEventListener('deviceready', sliders.init, false);
  });

});