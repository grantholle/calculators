define(['jquery', 'slider'], function ($) {

  var sliders = (function () {

    var $sliders = $('div.perc-slider'),
        $sliderWrap = $('div.has-slider'),
        $competitorSliderEle = $('div#competitor-mower-slider'),
        $propaneSliderEle = $('div#propane-mower-slider'),
        $fuelSliderEle = $('div#price-per-gallon'),

        // Tooltip inputs
        $competitorMowerPrice = $('input#competitor-mower-price'),
        $propaneMowerPrice = $('input#propane-mower-price'),
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

          $body.trigger('refreshCalculation', [$toggle.find('button.active').data('compare')]);

        },

        swapCompetitor = function (e) {
          fuelSlider.noUiSlider({
            start: [2, parseFloat($toggle.find('button.active').data('fuel-default'))]
          }, true);
        },

        createSliders = function () {

          // Tool tip action
          var customToolTipCompetitor = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$competitorMowerPrice.parent(), value, a[0].parentNode.offsetLeft]);
            }
          }),
          
          customToolTipPropane = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$propaneMowerPrice.parent(), value, a[0].parentNode.offsetLeft]);
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

          // Competitor mower purchase
          competitorSlider = $competitorSliderEle.noUiSlider({
            start: 10500,
            connect: 'lower',
            behaviour: 'snap',
            range: {
              min: 7500,
              max: 16500
            },
            step: 100,
            serialization: {
              format: {
                thousand: ',',
                prefix: '$',
                decimals: 0
              },
              lower: [ customToolTipCompetitor ]
            }
          });

          // Propane mower purchase
          propaneSlider = $propaneSliderEle.noUiSlider({
            start: 10500,
            connect: 'lower',
            behaviour: 'snap',
            range: {
              min: 7500,
              max: 16500
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

        };

    exports.init = init;

    return exports;

  })();

  return sliders;

});