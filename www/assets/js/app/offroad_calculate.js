define([], function() {

  var offroad_cacluator = (function () {

    var $body = $('body'),

        // Value inputs
        $mowers = $('input#mower-input'),
        $hours = $('input#annual-hours'),
        $otherMower = $('div#competitor-mower-slider'),
        $propMower = $('div#propane-mower-slider'),
        $fuelPrice = $('div#price-per-gallon'),

        exports = {},

        // Constants
        fuel_consumption = {
          propane: 1.36,
          gasoline: 1.3,
          diesel: 0.9
        },

        // Mowing app results - each key corresponds with a class in the dom
        offRoadResults = {
          fuel_per_hour: {
            fuel_cost: {
              prop: 0,
              other: 0
            }
          },
          fuel_per_year: {
            one_year: {
              prop: 0,
              other: 0
            },
            three_year: {
              prop: 0,
              other: 0
            },
            five_year: {
              prop: 0,
              other: 0
            }
          },
          propane_savings: {
            one_year: {
              prop: 0
            },
            three_year: {
              prop: 0
            },
            five_year: {
              prop: 0
            }
          }
        },

        refresh = function () {
          fuelCostsPerHour();
          fuelCostsPerYear();
          updateLabels();
        },

        // Updates labels based on offRoadResults object
        updateLabels = function () {
          $.each(offRoadResults, function (parent, children) {
            var $parent = $('.' + parent);

            $.each(children, function (child, values) {
              var $child = $parent.find('.' + child);

              $.each(values, function (key, value) {
                $child.find('.' + key).html(value);
              });
            });
          });
        },

        fuelCostsPerHour = function () {
          offRoadResults.fuel_per_hour = {
            prop: 1.36 * getFloatFromPrice($fuelPrice[0]),
            other: 
          };
        },

        fuelCostsPerYear = function () {
        },

        getFloatFromPrice = function (value) {
          value = value.replace('$', '');
          return parseFloat(value);
        },

        formatNumber = function (x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

    exports.refresh = refresh;
    exports.offRoadResults = offRoadResults;

    return exports;

  })();

  return offroad_cacluator;

});