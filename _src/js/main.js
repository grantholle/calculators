define(['app/config'], function(config) {

  // config dat mug.
  requirejs.config(config.requirejs);

  var toRequire = ['app/sliders/' + window.app + '_sliders', 'app/calculators/' + window.app + '_calculate', 'app/app', 'jquery'];

  require(toRequire, function (sliders, calc, app) {
    document.addEventListener('deviceready', sliders.init, false);
  });

});