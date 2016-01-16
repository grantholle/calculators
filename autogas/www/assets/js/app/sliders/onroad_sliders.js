define(['jquery', 'slider'], function ($) {

var sliders = (function () {

    // Sliders
    var $sliders = $('div.perc-slider'),
        $sliderWrap = $('div.has-slider'),
        $vehicleCostEle = $('div#competitor-vehicle-slider'),
        $conversionEle = $('div#conversion-cost-slider'),
        $propaneVehicleEle = $('div#propane-vehicle-cost-slider'),        
        $mpgSliderEle = $('div#average-mpg-slider'),
        $fuelSliderEle = $('div#price-per-gallon'),

        // Tooltip inputs and regular
        $vehiclePurchasePrice = $('input#competitor-vehicle-price'),
        $propaneVehicleCost = $('input#propane-vehicle-cost'),        
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
          propaneVehicleCostTooltip = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$propaneVehicleCost.parent(), value, a[0].parentNode.offsetLeft]);
            }
          }),
          
          conversionTooltip = $.Link({
            target: function (value, a, b) {
                // We must find offset pixels manually since jQuery's offsetLeft method doesn't work with hidden element
                leftStyle = $(a[0].parentNode).attr('style');   
                offset = leftStyle.replace('left: ', '').replace(';','');
                
                // Convert percentage to pixels
                if(offset.indexOf("%") > -1) {
                    offsetPercent = offset.replace('%', '');
                    parentWidth = ($('.noUi-base').width());                    
                    offset = (offsetPercent/100)*parentWidth;
                }    
                
                // Ensure offset is integer
                if(typeof(offset) == 'string') {
                    offset = parseInt(offset, 10);
                }   
                                
                // Finally trigger the move function
                $body.trigger('moveTooltip', [$conversionCost.parent(), value, offset, $conversionEle]);
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
          
          vehicleCostTooltip = $.Link({
            target: function (value, a, b) {
              $body.trigger('moveTooltip', [$vehiclePurchasePrice.parent(), value, a[0].parentNode.offsetLeft]);
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
          
          // Vehicle cost slider          
          
          vehicleCostSlider = $vehicleCostEle.noUiSlider({
            start: parseInt($toggle.find('button.active').data('vehicle-default'), 10),
            connect: 'lower',
            behaviour: 'snap',
            range: {
              min: 26000,
              max: 110000
            },
            step: 100,
            serialization: {
              format: {
                thousand: ',',
                prefix: '$',
                decimals: 0
              },
              lower: [ vehicleCostTooltip ]
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
          
          // Propane Vehicle Cost Slider
          propaneVehicleSlider = $propaneVehicleEle.noUiSlider({
            start: 42000,
            connect: 'lower',
            behaviour: 'snap',
            range: {
              min: 26000,
              max: 110000
            },
            step: 100,
            serialization: {
              format: {
                thousand: ',',
                prefix: '$',
                decimals: 0
              },
              lower: [ propaneVehicleCostTooltip ]
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
            start: [1.50, parseFloat($toggle.find('button.active').data('fuel-default'))],
            behaviour: 'snap',
            range: {
              min: .50,
              max: 6
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
            start: [1.50, parseFloat($toggle.find('button.active').data('fuel-default'))]
          }, true);

          vehicleCostSlider.noUiSlider({
            start: parseInt($toggle.find('button.active').data('vehicle-default'), 10)
          }, true);
          
          
          conversionSlider.noUiSlider({}, true);
          
          
          // If diesel
          if($('button.active').data('compare') == 'diesel') {
              $('#conversion-cost-row').hide();
              $('#propane-vehicle-cost-row').show();
          }
          else {
              $('#conversion-cost-row').show();
              $('#propane-vehicle-cost-row').hide();              
          }         
          
        };

    exports.init = init;

    return exports;

  })();

  return sliders;

});