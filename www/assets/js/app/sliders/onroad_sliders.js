define(['jquery', 'slider'], function ($) {

  var sliders = (function () {

    // Sliders
    var $sliders = $('div.perc-slider'),
        $sliderWrap = $('div.has-slider'),
        $purchaseSliderEle = $('div#competitor-vehicle-slider'),
        $conversionEle = $('div#conversion-cost-slider'),
        $mpgSliderEle = $('div#average-mpg-slider'),
        $fuelSliderEle = $('div#price-per-gallon'),

        // Tooltip inputs and regular
        $vehiclePurchasePrice = $('input#competitor-vehicle-price'),
        $conversionCost = $('input#conversion-cost'),
        $propaneAverageMpg = $('input#propane-average-mpg'),
        $averageMpg = $('input#average-mpg'),
        $competitorFuelPrice = $('input#comp-fuel-price'),
        $propaneFuelPrice = $('input#propane-fuel-price'),

        $toggle = $('div.toggle-group'),
        $body = $('body'),
        exports = {},

        init = function () {

          createSliders();
          events();

        },

        events = function () {

          $body.on('swapCompetitor', swapCompetitor);

          $body.on('initializeSlider', createSliders);

          $body.trigger('slidersInitialized');

        },

        createSliders = function () {

          // Tool tip action
          var vehiclePriceTooltip = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$vehiclePurchasePrice.parent(), value, a[0].parentNode.offsetLeft]);
            }
          }),
          
          mpgUpperTooltip = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$propaneAverageMpg.parent(), value, a[0].parentNode.offsetLeft]);
            }
          }),
          
          mpgLowerTooltip = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$averageMpg.parent(), value, a[0].parentNode.offsetLeft]);
            }
          }),
          
          conversionTooltip = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$conversionCost.parent(), value, a[0].parentNode.offsetLeft]);
            }
          }),
          
          customToolTipTopFuel = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$propaneFuelPrice.parent(), value, a[0].parentNode.offsetLeft, $fuelSliderEle]);
            }
          }),
          
          customToolTipBottomFuel = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$competitorFuelPrice.parent(), value, a[0].parentNode.offsetLeft, $fuelSliderEle]);
            }
          });

          // Sliders
          // Vehicle price slider
          purchaseSlider = $purchaseSliderEle.noUiSlider({
            start: parseInt($toggle.find('button.active').data('vehicle-default'), 10),
            connect: 'lower',
            behaviour: 'snap',
            range: {
              min: 26000,
              max: 60000
            },
            step: 100,
            serialization: {
              format: {
                thousand: ',',
                prefix: '$',
                decimals: 0
              },
              lower: [ vehiclePriceTooltip ]
            }
          });

          // Conversion cost slider
          conversionSlider = $conversionEle.noUiSlider({
            start: 12000,
            connect: 'lower',
            behaviour: 'snap',
            range: {
              min: 5000,
              max: 25000
            },
            step: 100,
            serialization: {
              format: {
                thousand: ',',
                prefix: '$',
                decimals: 0
              },
              lower: [ conversionTooltip ]
            }
          });

          // MPG range
          mpgSlider = $mpgSliderEle.noUiSlider({
            start: [11, 14],
            behaviour: 'snap',
            range: {
              min: 4,
              max: 40
            },
            step: 0.5,
            serialization: {
              format: {
                decimals: 1
              },
              lower: [ mpgUpperTooltip ],
              upper: [ mpgLowerTooltip ]
            }
          });

          // Price per gallon
          fuelSlider = $fuelSliderEle.noUiSlider({
            start: [2, parseFloat($toggle.find('button.active').data('fuel-default'))],
            behaviour: 'snap',
            range: {
              min: 1.25,
              max: 5
            },
            step: 0.01,
            serialization: {
              format: {
                prefix: '$'
              },
              lower: [ customToolTipTopFuel ],
              upper: [ customToolTipBottomFuel ]
            }
          });
        },

        swapCompetitor = function () {
          fuelSlider.noUiSlider({
            start: [2, parseFloat($toggle.find('button.active').data('fuel-default'))]
          }, true);

          purchaseSlider.noUiSlider({
            start: parseInt($toggle.find('button.active').data('vehicle-default'), 10)
          }, true);
        };

    exports.init = init;

    return exports;

  })();

  return sliders;

});