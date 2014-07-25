define([], function() {

  var cacluator = (function () {

    var exports = {},

        refresh = function () {
          console.log('Hi refreshing bye');
        };

    exports.refresh = refresh;

    return exports;

  })();

});