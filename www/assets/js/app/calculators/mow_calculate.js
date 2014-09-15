define(['jquery'], function($) {

  var calculator = (function () {

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
        mowers,
        perHourPropaneFloat,
        perHourOtherFloat,

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
        results = { app: 'offroad' }, // This is what we're going to encode to send

        events = function () {

          $body.on('refreshCalculation', refresh);

        },

        refresh = function (competitor) {
          if (typeof competitor === 'undefined')
            competitor = 'diesel';

          currentCompetitor = competitor;
          formattedCompetitor = competitor.charAt(0).toUpperCase() + competitor.slice(1);
          mowers = parseInt($mowers.val(), 10);
          
          fuelCostsPerHour();
          fuelCostsPerYear();
          propaneSavings();
          updateLabels();

          $body.trigger('refreshWaypoint');
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

          perHourPropaneFloat = propane = propane * mowers;
          perHourOtherFloat = comp = comp * mowers;

          offRoadResults.fuel_per_hour.fuel_cost = {
            prop: propane.toFixed(2),
            other: comp.toFixed(2)
          };
        },

        fuelCostsPerYear = function () {
          var hours = parseInt($hours.val(), 10),
              propane = hours * perHourPropaneFloat,
              comp = hours * perHourOtherFloat;

          offRoadResults.fuel_per_year = {
            one_year: {
              prop: Math.round(propane * mowers),
              other: Math.round(comp * mowers)
            },
            three_year: {
              prop: Math.round(propane * 3 * mowers),
              other: Math.round(comp * 3 * mowers)
            },
            five_year: {
              prop: Math.round(propane * 5 * mowers),
              other: Math.round(comp * 5 * mowers)
            }
          };
        },

        propaneSavings = function () {
          var prop_mower = parseInt(cleanNumber($propMower.val()), 10),
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
              label: 'Compare Propane with',
              value: formattedCompetitor
            },
            {
              label: 'Number of Mowers',
              value: $mowers.val()
            },
            {
              label: 'Total Hours Mowed per Year (per mower)',
              value: $hours.val()
            },
            {
              label: 'Propane Mower Purchase Amount',
              value: $propMower.val()
            },
            {
              label: formattedCompetitor + ' Mower Purchase Amount',
              value: $otherMower.val()
            },
            {
              label: 'Price per Gallon of Propane',
              value: $fuelPrice.val()[0]
            },
            {
              label: 'Price per Gallon of ' + formattedCompetitor,
              value: $fuelPrice.val()[1]
            }
          ];
        },

        resultsOutput = function () {
          results.output = [
            {
              label: 'Fuel Costs per Hour of Mowing',
              body: [
                [ 'PROPANE', formattedCompetitor.toUpperCase() ],
                [ '$' + offRoadResults.fuel_per_hour.fuel_cost.prop, '$' + offRoadResults.fuel_per_hour.fuel_cost.other ]
              ]
            },
            {
              label: 'Fuel Costs per',
              body: [
                [ '', '1 YEAR', '3 YEARS', '5 YEARS' ],
                [ 'PROPANE', '$' + formatNumber(offRoadResults.fuel_per_year.one_year.prop), '$' + formatNumber(offRoadResults.fuel_per_year.three_year.prop), '$' + formatNumber(offRoadResults.fuel_per_year.five_year.prop) ],
                [ formattedCompetitor.toUpperCase(), '$' + formatNumber(offRoadResults.fuel_per_year.one_year.other), '$' + formatNumber(offRoadResults.fuel_per_year.three_year.other), '$' + formatNumber(offRoadResults.fuel_per_year.five_year.other) ]
              ]
            },
            {
              label: 'Total Savings Using Propane',
              body: [
                [ '1 YEAR', '3 YEARS', '5 YEARS' ],
                [ '$' + formatNumber(offRoadResults.propane_savings.one_year.prop), '$' + formatNumber(offRoadResults.propane_savings.three_year.prop), '$' + formatNumber(offRoadResults.propane_savings.five_year.prop) ]
              ]
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

    events();

    return exports;

  })();

  return calculator;

});