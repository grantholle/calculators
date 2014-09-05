define(['jquery'], function($) {

  var calculator = (function () {

    var $body = $('body'),

        // Value inputs
        $horsepower = $('input#horsepower-input'),
        $hours = $('input#annual-hours'),
        $dieselEngine = $('div#competitor-engine-slider'),
        $propEngine = $('div#propane-engine-slider'),
        $fuelPrice = $('div#price-per-gallon'),

        $results = $('section#results'),

        exports = {},
        agData = {
          engineCost: {},
          fuelCost: {
            propane: {},
            diesel: {}
          },
          totalCost: {
            propane: {},
            diesel: {}
          },
          fuelSavings: {},
          totalSavings: {},
          horsepower: 0,
          hoursOfUsage: 0,
          gallonsConsumed: 13.76,
          dieselRatio: 1.57
        },
        results = { app: 'ag' },

        events = function () {

          $body.on('refreshCalculation', refresh);

        },

        refresh = function () {
          engineCost();
          propaneFuelCost();
          propaneFuelSavings();
          totalSavings();

          $body.trigger('refreshWaypoint');
        },

        engineCost = function () {
          agData.engineCost.propane = parseInt(cleanNumber($propEngine.val()), 10);
          agData.engineCost.diesel = parseInt(cleanNumber($dieselEngine.val()), 10);
        },

        propaneFuelCost = function () {
          var $fuelCost = $results.find('div.propane-fuel-cost');

          agData.horsepower = parseInt($horsepower.val(), 10);
          agData.hoursOfUsage = parseInt($hours.val(), 10);
          agData.fuelCost.propane.perGallon = parseFloat(cleanNumber($fuelPrice.val()[0]));
          agData.fuelCost.diesel.perGallon = parseFloat(cleanNumber($fuelPrice.val()[1]));
          agData.fuelCost.propane.perHour = agData.horsepower / agData.gallonsConsumed * agData.fuelCost.propane.perGallon;
          agData.fuelCost.diesel.perHour = agData.horsepower / agData.gallonsConsumed / agData.dieselRatio * agData.fuelCost.diesel.perGallon;
          agData.fuelCost.propane.oneYear = agData.fuelCost.propane.perHour * agData.hoursOfUsage;
          agData.fuelCost.diesel.oneYear = agData.fuelCost.diesel.perHour * agData.hoursOfUsage;
          agData.fuelCost.propane.fiveYear = agData.fuelCost.propane.perHour * (agData.hoursOfUsage * 5);
          agData.fuelCost.diesel.fiveYear = agData.fuelCost.diesel.perHour * (agData.hoursOfUsage * 5);

          agData.totalCost.propane.fiveYear = agData.fuelCost.propane.fiveYear + agData.engineCost.propane;
          agData.totalCost.diesel.fiveYear = agData.fuelCost.diesel.fiveYear + agData.engineCost.diesel;

          $fuelCost.find('div.one_year span.prop').html('$' + formatNumber(Math.round(agData.fuelCost.propane.oneYear)));
          $fuelCost.find('div.five_year span.prop').html('$' + formatNumber(Math.round(agData.fuelCost.propane.fiveYear)));
          $fuelCost.find('div.one_year strong.diesel').html('$' + formatNumber(Math.round(agData.fuelCost.diesel.oneYear)));
          $fuelCost.find('div.five_year strong.diesel').html('$' + formatNumber(Math.round(agData.fuelCost.diesel.fiveYear)));
        },

        propaneFuelSavings = function () {
          var $savings = $results.find('div.propane-savings');

          agData.fuelSavings.hourly = agData.fuelCost.diesel.perHour - agData.fuelCost.propane.perHour;
          agData.fuelSavings.oneYear = agData.fuelSavings.hourly * agData.hoursOfUsage;
          agData.fuelSavings.fiveYear = agData.fuelCost.diesel.fiveYear - agData.fuelCost.propane.fiveYear;

          $savings.find('div.hourly span.prop').html('$' + agData.fuelSavings.hourly.toFixed(2));
          $savings.find('div.one_year span.prop').html('$' + formatNumber(Math.round(agData.fuelSavings.oneYear)));
          $savings.find('div.five_year span.prop').html('$' + formatNumber(Math.round(agData.fuelSavings.fiveYear)));
        },

        totalSavings = function () {
          var $savings = $results.find('div.total-savings');
          
          agData.totalSavings.oneYear = (agData.engineCost.diesel - agData.engineCost.propane) + agData.fuelSavings.oneYear;
          agData.totalSavings.fiveYear = agData.totalCost.diesel.fiveYear - agData.totalCost.propane.fiveYear;

          $savings.find('div.one_year span.prop').html('$' + formatNumber(Math.round(agData.totalSavings.oneYear)));
          $savings.find('div.five_year span.prop').html('$' + formatNumber(Math.round(agData.totalSavings.fiveYear)));
        },

        resultsInput = function () {
          results.input = [
            {
              label: 'Horsepower Required',
              value: $horsepower.val()
            },
            {
              label: 'Hours of Usage per Year',
              value: $hours.val()
            },
            {
              label: 'Propane Engine Purchase Amount',
              value: $propEngine.val()
            },
            {
              label: 'Diesel Engine Purchase Amount',
              value: $dieselEngine.val()
            },
            {
              label: 'Propane Price per Gallon',
              value: $fuelPrice.val()[0]
            },
            {
              label: 'Diesel Price per Gallon',
              value: $fuelPrice.val()[1]
            }
          ];
        },

        resultsOutput = function () {
          results.output = [
            {
              label: 'Propane Fuel Savings',
              body: [
                ['Hourly', '1 Year', '5 Years'],
                ['$' + agData.fuelSavings.hourly.toFixed(2), '$' + formatNumber(Math.round(agData.fuelSavings.oneYear)), '$' + formatNumber(Math.round(agData.fuelSavings.fiveYear))]
              ]
            },
            {
              label: 'Total Savings Using Propane',
              body: [
                ['1 Year', '5 Years'],
                ['$' + formatNumber(Math.round(agData.totalSavings.oneYear)), '$' + formatNumber(Math.round(agData.totalSavings.fiveYear))]
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