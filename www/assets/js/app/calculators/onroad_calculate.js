define(['jquery'], function ($) {

  var calculator = (function () {

    var $body = $('body'),

        // Labels
        $vehicleCosts = $('div.vehicle-cost'),
        $operatingCosts = $('div.operating-costs'),
        $lifetimeCosts = $('div.lifetime-costs'),

        // Value inputs
        $vehiclePrice = $('input#competitor-vehicle-price'),
        $conversionCost = $('input#conversion-cost'),
        $averageMpg = $('div#average-mpg-slider'),
        $fuelPrice = $('div#price-per-gallon'),
        $vehicle = $('input#type-of-vehicle'),

        exports = {},
        currentCompetitor,
        formattedCompetitor,

        constants = {
          propaneConverstion: 0,
          vehicleLifeMiles: 200000,
          lifetimePmVisits: {
            propane: 40,
            gasoline: 40,
            diesel: 50
          },
          pmCost: {
            propane: 50,
            gasoline: 50,
            diesel: 110
          },
          airFilters: {
            propane: (20 * 10),
            diesel: (26 * 10),
            gasoline: (20 * 10)
          },
          fuelFilters: {
            propane: (30 * 7),
            gasoline: (30 * 7),
            diesel: (106 * 25) + 1875
          }
        },
        
        onroadResults = {
          prop: {},
          other: {}
        },

        results = { app: 'onroad' }, // This is what we're going to encode to send

        events = function () {

          $body.on('refreshCalculation', refresh);

        },

        refresh = function (e, competitor) {
          if (typeof competitor === 'undefined')
            competitor = 'diesel';
          
          currentCompetitor = competitor;
          formattedCompetitor = competitor.charAt(0).toUpperCase() + competitor.slice(1);

          constants.propaneConverstion = parseInt(cleanNumber($conversionCost.val()), 10);

          vehicleCosts();
          operatingCosts();
          lifetimeCosts();

          $body.trigger('refreshWaypoint');
        },

        // Updates labels based on offRoadResults object
        vehicleCosts = function () {
          onroadResults.other.vehicleCost = parseInt(cleanNumber($vehiclePrice.val()), 10);
          onroadResults.prop.vehicleCost = onroadResults.other.vehicleCost + constants.propaneConverstion;

          $vehicleCosts.find('strong.other').html($vehiclePrice.val());
          $vehicleCosts.find('span.prop').html('$' + formatNumber(onroadResults.prop.vehicleCost));
        },

        operatingCosts = function () {
          var propFuel = parseFloat(cleanNumber($fuelPrice.val()[0])),
              compFuel = parseFloat(cleanNumber($fuelPrice.val()[1])),
              compMpg = parseFloat($averageMpg.val()[1]),
              propMpg = parseFloat($averageMpg.val()[0]),
              propMpgLife = constants.vehicleLifeMiles / propMpg,
              compMpgLife = constants.vehicleLifeMiles / compMpg;

          onroadResults.prop.fuelCostsLife = propMpgLife * propFuel;
          onroadResults.other.fuelCostsLife = compMpgLife * compFuel;
          onroadResults.prop.pmCosts = constants.lifetimePmVisits.propane * constants.pmCost.propane;
          onroadResults.other.pmCosts = constants.lifetimePmVisits[currentCompetitor] * constants.pmCost[currentCompetitor];
          onroadResults.prop.addCosts = constants.airFilters.propane + constants.fuelFilters.propane;
          onroadResults.other.addCosts = constants.airFilters[currentCompetitor] + constants.fuelFilters[currentCompetitor];

          // Fuel Costs
          $operatingCosts.find('div.fuel-costs span.prop').html('$' + formatNumber(Math.round(onroadResults.prop.fuelCostsLife)));
          $operatingCosts.find('div.fuel-costs strong.other').html('$' + formatNumber(Math.round(onroadResults.other.fuelCostsLife)));

          // Lifetime parts
          $operatingCosts.find('div.parts span.prop').html('$' + formatNumber(onroadResults.prop.pmCosts));
          $operatingCosts.find('div.parts strong.other').html('$' + formatNumber(onroadResults.other.pmCosts));

          // Lifetime additional
          $operatingCosts.find('div.additional span.prop').html('$' + formatNumber(onroadResults.prop.addCosts));
          $operatingCosts.find('div.additional strong.other').html('$' + formatNumber(onroadResults.other.addCosts));

        },

        lifetimeCosts = function () {
          var comp = onroadResults.other,
              prop = onroadResults.prop;
          
          onroadResults.other.perVehicle = comp.vehicleCost + comp.fuelCostsLife + comp.pmCosts + comp.addCosts;
          onroadResults.prop.perVehicle = prop.vehicleCost + prop.fuelCostsLife + prop.pmCosts + prop.addCosts;
          onroadResults.other.perMile = onroadResults.other.perVehicle / constants.vehicleLifeMiles;
          onroadResults.prop.perMile = onroadResults.prop.perVehicle / constants.vehicleLifeMiles;

          // Per vehicle
          $lifetimeCosts.find('div.vehicle strong.other').html('$' + formatNumber(Math.round(onroadResults.other.perVehicle)));
          $lifetimeCosts.find('div.vehicle span.prop').html('$' + formatNumber(Math.round(onroadResults.prop.perVehicle)));

          // Per mile
          $lifetimeCosts.find('div.mile strong.other').html('$' + onroadResults.other.perMile.toFixed(2));
          $lifetimeCosts.find('div.mile span.prop').html('$' + onroadResults.prop.perMile.toFixed(2));

        },

        resultsInput = function () {
          results.input = [
            {
              label: 'Compare Propane Autogas with',
              value: formattedCompetitor
            },
            {
              label: 'Type of Vehicle',
              value: $vehicle.val()
            },
            {
              label: 'Vehicle Purchase Amount',
              value: $vehiclePrice.val()
            },
            {
              label: 'Propane Average MPG',
              value: $averageMpg.val()[0]
            },
            {
              label: formattedCompetitor + ' Average MPG',
              value: $averageMpg.val()[1]
            },
            {
              label: 'Propane Price per Gallon',
              value: $fuelPrice.val()[0]
            },
            {
              label: formattedCompetitor + ' Price per Gallon',
              value: $fuelPrice.val()[1]
            }
          ];
        },

        resultsOutput = function () {
          results.output = [
            {
              label: 'Vehicle Cost',
              body: [
                ['Propane', formattedCompetitor],
                ['$' + formatNumber(onroadResults.prop.vehicleCost), $vehiclePrice.val()]
              ]
            },
            {
              label: 'Lifetime Operating Costs',
              body: [
                ['', 'Fuel Costs', 'Parts and Maintenance', 'Additional Costs'],
                ['Propane', '$' + formatNumber(Math.round(onroadResults.prop.fuelCostsLife)), '$' + formatNumber(onroadResults.prop.pmCosts), '$' + formatNumber(onroadResults.prop.addCosts)],
                [formattedCompetitor, '$' + formatNumber(Math.round(onroadResults.other.fuelCostsLife)), '$' + formatNumber(onroadResults.other.pmCosts), '$' + formatNumber(onroadResults.other.addCosts)]
              ]
            },
            {
              label: 'Lifetime Ownership Costs',
              body: [
                ['', 'Per Vehicle', 'Per Mile Average'],
                ['Propane', '$' + formatNumber(Math.round(onroadResults.prop.perVehicle)), '$' + formatNumber(Math.round(onroadResults.prop.perMile))],
                [formattedCompetitor, '$' + formatNumber(Math.round(onroadResults.other.perVehicle)), '$' + formatNumber(Math.round(onroadResults.other.perMile))]
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