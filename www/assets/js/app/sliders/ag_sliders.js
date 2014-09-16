define(['jquery', 'slider'], function ($) {

  var sliders = (function () {

    var $sliders = $('div.perc-slider'),
        $sliderWrap = $('div.has-slider'),
        $dieselSliderEle = $('div#competitor-engine-slider'),
        $propaneSliderEle = $('div#propane-engine-slider'),
        $fuelSliderEle = $('div#price-per-gallon'),

        // Tooltip inputs
        $dieselEnginePrice = $('input#competitor-engine-price'),
        $propaneEnginePrice = $('input#propane-engine-price'),
        $dieselFuelPrice = $('input#comp-fuel-price'),
        $propaneFuelPrice = $('input#propane-fuel-price'),

        $body = $('body'),
        exports = {},

        init = function () {

          createSliders();
          events();

        },

        events = function () {

          $body.on('swapCompetitor', swapCompetitor);

          $body.trigger('slidersInitialized');

        },

        createSliders = function () {

          // Tool tip action
          var customToolTipDiesel = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$dieselEnginePrice.parent(), value, a[0].parentNode.offsetLeft]);
            }
          }),
          
          customToolTipPropane = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$propaneEnginePrice.parent(), value, a[0].parentNode.offsetLeft]);
            }
          }),
          
          customToolTipTopFuel = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$propaneFuelPrice.parent(), value, a[0].parentNode.offsetLeft, $fuelSliderEle]);
            }
          }),
          
          customToolTipBottomFuel = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$dieselFuelPrice.parent(), value, a[0].parentNode.offsetLeft, $fuelSliderEle]);
            }
          });

          // Sliders
          // Competitor engine purchase
          dieselSlider = $dieselSliderEle.noUiSlider({
            start: 10000,
            connect: 'lower',
            behaviour: 'snap',
            range: {
              min: 5000,
              max: 125000
            },
            step: 100,
            serialization: {
              format: {
                thousand: ',',
                prefix: '$',
                decimals: 0
              },
              lower: [ customToolTipDiesel ]
            }
          });

          // Propane engine purchase
          propaneSlider = $propaneSliderEle.noUiSlider({
            start: 10000,
            connect: 'lower',
            behaviour: 'snap',
            range: {
              min: 5000,
              max: 125000
            },
            step: 100,
            serialization: {
              format: {
                thousand: ',',
                prefix: '$',
                decimals: 0
              },
              lower: [ customToolTipPropane ]
            }
          });

          // Price per gallon
          // Upper (index 0) is propane
          // Lower (index 1) is competitor
          fuelSlider = $fuelSliderEle.noUiSlider({
            start: [2, 3.90],
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

        };

    exports.init = init;
    exports.swapCompetitor = swapCompetitor;

    return exports;

  })();

  return sliders;
});