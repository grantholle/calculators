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
        currentCompetitor,
        formattedCompetitor,

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
        results = {}, // This is what we're going to encode to send

        refresh = function (competitor) {
          currentCompetitor = competitor;
          formattedCompetitor = competitor.charAt(0).toUpperCase() + competitor.slice(1);
          
          fuelCostsPerHour();
          fuelCostsPerYear();
          propaneSavings();
          updateLabels();
        },

        // Updates labels based on offRoadResults object
        updateLabels = function () {
          $.each(offRoadResults, function (parent, children) {
            var $parent = $('.' + parent);

            $.each(children, function (child, values) {
              var $child = $parent.find('.' + child);

              $.each(values, function (key, value) {
                $child.find('.' + key).html('$' + formatNumber(value));
              });
            });
          });
        },

        fuelCostsPerHour = function () {
          var propane = fuel_consumption.propane * parseFloat(cleanNumber($fuelPrice.val()[0])),
              comp = fuel_consumption[currentCompetitor] * parseFloat(cleanNumber($fuelPrice.val()[1]));

          offRoadResults.fuel_per_hour.fuel_cost = {
            prop: propane.toFixed(2),
            other: comp.toFixed(2)
          };
        },

        fuelCostsPerYear = function () {
          var hours = parseInt($hours.val(), 10),
              propane = hours * offRoadResults.fuel_per_hour.fuel_cost.prop,
              comp = hours * offRoadResults.fuel_per_hour.fuel_cost.other;

          offRoadResults.fuel_per_year = {
            one_year: {
              prop: Math.round(propane),
              other: Math.round(comp)
            },
            three_year: {
              prop: Math.round(propane * 3),
              other: Math.round(comp * 3)
            },
            five_year: {
              prop: Math.round(propane * 5),
              other: Math.round(comp * 5)
            }
          };
        },

        propaneSavings = function () {
          var mowers = parseInt($mowers.val(), 10),
              prop_mower = parseInt(cleanNumber($propMower.val()), 10),
              other_mower = parseInt(cleanNumber($otherMower.val()), 10);

          offRoadResults.propane_savings = {
            one_year: {
              prop: (other_mower * mowers) - (prop_mower * mowers) + (offRoadResults.fuel_per_year.one_year.other - offRoadResults.fuel_per_year.one_year.prop)
            },
            three_year: {
              prop: (other_mower * mowers) - (prop_mower * mowers) + (offRoadResults.fuel_per_year.three_year.other - offRoadResults.fuel_per_year.three_year.prop)
            },
            five_year: {
              prop: (other_mower * mowers) - (prop_mower * mowers) + (offRoadResults.fuel_per_year.five_year.other - offRoadResults.fuel_per_year.five_year.prop)
            }
          };
        },

        resultsInput = function () {
          results.input = [
            {
              label: 'Compare Propane vs.',
              value: formattedCompetitor
            },
            {
              label: 'Number of Mowers',
              value: $mowers.val()
            },
            {
              label: 'Total Hours per Year',
              value: $hours.val()
            },
            {
              label: 'Mower Purchase Amount',
              value: [
                { label: 'Propane', value: $propMower.val() },
                { label: formattedCompetitor, value: $otherMower.val() }
              ]
            },
            {
              label: 'Price per Gallon',
              value: [
                { label: 'Propane', value: $fuelPrice.val()[0] },
                { label: formattedCompetitor, value: $fuelPrice.val()[1] }
              ]
            }
          ];
        },

        resultsOutput = function () {
          results.output = [
            {
              label: 'Fuel Costs per Hour of Mowing',
              value: [
                { label: 'Propane', value: '$' + offRoadResults.fuel_per_hour.fuel_cost.prop },
                { label: formattedCompetitor, value: '$' + offRoadResults.fuel_per_hour.fuel_cost.other }
              ]
            },
            {
              label: 'Fuel Costs per Year',
              value: [
                { label: 'Propane', value: '$' + offRoadResults.fuel_per_year.one_year.prop },
                { label: formattedCompetitor, value: '$' + offRoadResults.fuel_per_year.one_year.other }
              ]
            },
            {
              label: 'Fuel Costs per Three Years',
              value: [
                { label: 'Propane', value: '$' + offRoadResults.fuel_per_year.three_year.prop },
                { label: formattedCompetitor, value: '$' + offRoadResults.fuel_per_year.three_year.other }
              ]
            },
            {
              label: 'Fuel Costs per Three Years',
              value: [
                { label: 'Propane', value: '$' + offRoadResults.fuel_per_year.five_year.prop },
                { label: formattedCompetitor, value: '$' + offRoadResults.fuel_per_year.five_year.other }
              ]
            },
            {
              label: 'Total Savings Using Propane Over One Year',
              value: '$' + offRoadResults.propane_savings.one_year.prop
            },
            {
              label: 'Total Savings Using Propane Over Three Years',
              value: '$' + offRoadResults.propane_savings.three_year.prop
            },
            {
              label: 'Total Savings Using Propane Over Five Years',
              value: '$' + offRoadResults.propane_savings.five_year.prop
            }
          ];
        },

        cleanNumber = function (value) {
          return value.replace('$', '').replace(',', '');
        },

        formatNumber = function (x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

    exports.refresh = refresh;
    exports.results = function () {
      resultsInput();
      resultsOutput();

      return results;
    };

    return exports;

  })();

  return offroad_cacluator;

});