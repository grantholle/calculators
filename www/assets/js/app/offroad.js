define(['app/offroad_calculate', 'fastclick', 'magnific', 'slider'], function (calculate) {

  var mow_app = (function () {

    var $toggle = $('div.toggle-group'),
        $increment = $('div.increment-input'),
        $shareBtn = $('a#share-button'),
        $tabs = $('div.tabbed'),
        $body = $('body'),
        $modal = $('div.modal'),

        // Sliders
        $sliders = $('div.perc-slider'),
        $sliderWrap = $('.has-slider'),
        $competitorSliderEle = $('div#competitor-mower-slider'),
        $propaneSliderEle = $('div#propane-mower-slider'),
        $fuelSliderEle = $('div#price-per-gallon'),

        // Tooltips
        $competitorMowerPrice = $('input#competitor-mower-price'),
        $propaneMowerPrice = $('input#propane-mower-price'),

        competitor = $toggle.find('button.active').data('compare'), // should we store this? Idk
        competitorSlider,
        propaneSlider,
        fuelSlider,
        appWidth = $(window).width(),
        processInput = true, // Flag used to change input blur behavior to prevent endless loop

        init = function () {
          FastClick.attach(document.body);
          bindings();
        },

        bindings = function () {

          $(window).resize(function () {
            appWidth = $(window).width();
          });

          // Toggle buttons
          $toggle.on('click', 'button', function (e) {
            $target = $(e.currentTarget);

            if (!$target.hasClass('active')) {
              swapCompetitor($target);
            }
          });

          // Increment/decrement
          $increment.on('click', 'button', function (e) {
            var $input = $(e.currentTarget).parent().find('input[type=number]'),
                value = parseInt($input.val(), 10),
                min = parseInt($input.data('min'), 10),
                max = parseInt($input.data('max'), 10),
                change = parseInt($(e.currentTarget).data('value'), 10),
                newVal = value + change,
                populate;

            if (newVal < min)
              populate = min;
            else if (newVal > max)
              populate = max;
            else
              populate = newVal;

            $input.val(populate);

            // refresh calculation
            calculate.refresh();

          }).on('blur', 'input', function (e) {
            if (processInput) {
              roundInput($(e.currentTarget));
            } else {
              processInput = true;
            }

            // refresh calculation
            calculate.refresh();

          }).on('keypress', 'input', function (e) {
            if (e.keyCode === 13) {
              var $input = $(e.currentTarget);
              processInput = false;
              roundInput($input);
              $input.blur();
            }
          });

          // Sliders
          sliders();

          // Trigger calculation after done dragging or moving
          $sliders.on('change', function (e) {
            // console.log($fuelSliderEle.val());
            calculate.refresh();
          });

          // Events for slider input fields and their behavior on blur and enter
          $sliderWrap.on('focus', 'input[type=text]', function (e) {
            var $input = $(e.currentTarget);
            
            $input.data('original-string', $input.val());
            $input.val('');
          }).on('keypress', 'input[type=text]', function (e) {
            if (e.keyCode === 13) {
              $(e.currentTarget).blur();
            }
          }).on('blur', 'input[type=text]', function (e) {
            var $input = $(e.currentTarget);

            if ($input.val() === '') {
              $input.val($input.data('original-string'));
            } else {
              $input.parents('.slider-wrapper').find('.perc-slider').val($input.val());
            }
          });

          // Tabs
          $tabs.on('click', 'li', function (e) {
            var $thisTab = $(e.currentTarget);

            if (!$thisTab.hasClass('active')) {
              var $parent = $thisTab.parents('div.tabbed'),
                  tab = $thisTab.data('tab');

              $parent.find('li.active').removeClass('active');
              $parent.find('div.result-data').removeClass('active');
              $parent.find('div.' + tab).addClass('active');
              $thisTab.addClass('active');
            }
          });

          // Share popup
          $shareBtn.magnificPopup({
            showCloseBtn: false
          });

          // Close the share modal
          $modal.on('click', 'div.close', function (e) {
            $.magnificPopup.close();
          });

        },

        swapCompetitor = function ($target) {
          var mower_range = $target.data('mower-range').split(','),
              fuel_range = $target.data('fuel-range').split(',');

          competitor = $target.data('compare');

          // Update toggle buttons
          $toggle.find('button.active').removeClass('active');
          $target.addClass('active');

          // Swap labels
          $body.find('.compare').html(competitor);

          // Update slider settings based on new competitor
          // Mower price
          competitorSlider.noUiSlider({
            start: parseInt($toggle.find('button.active').data('mower-default'), 10),
            range: {
              min: parseInt(mower_range[0], 10),
              max: parseInt(mower_range[1], 10)
            }
          }, true);

          // Fuel Price
          // Not sure if/when this will actually change the min/max
          fuelSlider.noUiSlider({
            start: [2, parseInt($toggle.find('button.active').data('fuel-default'), 10)],
            range: {
              min: 1.25,
              max: 5
            }
          }, true);

          // Refresh the calculation
          calculate.refresh();

        },

        sliders = function () {

          // Tool tip action
          var customToolTipCompetitor = $.Link({
            target: function (value, a, b) {
              $competitorMowerPrice.val(value);

              // console.log(a, a[0].parentNode.offsetLeft);

              if (a[0].parentNode.offsetLeft < 55)
                $competitorMowerPrice.parent().css('left', 20);
              else if (a[0].parentNode.offsetLeft > (appWidth - 95))
                $competitorMowerPrice.parent().css('left', (appWidth - 130));
              else
                $competitorMowerPrice.parent().css('left', a[0].parentNode.offsetLeft - 34);
            }
          });
          
          var customToolTipPropane = $.Link({
            target: function (value, a, b) {
              $propaneMowerPrice.val(value);

              if (a[0].parentNode.offsetLeft < 55)
                $propaneMowerPrice.parent().css('left', 20);
              else if (a[0].parentNode.offsetLeft > (appWidth - 95))
                $propaneMowerPrice.parent().css('left', (appWidth - 130));
              else
                $propaneMowerPrice.parent().css('left', a[0].parentNode.offsetLeft - 34);
            }
            // old
            // target: '-tooltip-<div class="tooltip tooltip-top"></div>',
            // method: function ( value, a, b ) {
            //   // console.log(value, a, b);
            //   // console.log(a[0].parentNode.offsetLeft);

            //   $(this).html(
            //     '<span class="value">' + value + '</span>' +
            //     // '<input type="text" class="value" value="' + value + '">' +
            //     '<span class="label">Per Mower</span>'
            //   );
            // }
          });
          
          var customToolTipTopFuel = $.Link({
            target: '-tooltip-<div class="tooltip tooltip-top"></div>',
            method: function ( value ) {
              $(this).html(
                '<span class="value">' + value + '</span>' +
                '<span class="label">Propane</span>'
              );
            }
          });
          
          var customToolTipBottomFuel = $.Link({
            target: '-tooltip-<div class="tooltip tooltip-bottom"></div>',
            method: function ( value ) {
              $(this).html(
                '<span class="label compare">Diesel</span>' +
                '<input type="text" class="value" value="' + value + '">'
                // '<span class="value">' + value + '</span>'
              );
            }
          });

          // Sliders
          // Competitor mower purchase
          var competitor_range = $toggle.find('button.active').data('mower-range').split(',');
          competitorSlider = $competitorSliderEle.noUiSlider({
            start: parseInt($toggle.find('button.active').data('mower-default'), 10),
            connect: 'lower',
            range: {
              min: parseInt(competitor_range[0], 10),
              max: parseInt(competitor_range[1], 10)
            },
            step: 50,
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
            range: {
              min: 7500,
              max: 16500
            },
            step: 50,
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
          var fuel_range = $toggle.find('button.active').data('fuel-range').split(',');
          fuelSlider = $fuelSliderEle.noUiSlider({
            start: [2, parseInt($toggle.find('button.active').data('fuel-default'), 10)],
            // connect: true,
            range: {
              min: 1.25,
              max: 5
            },
            step: 0.05,
            serialization: {
              format: {
                prefix: '$'
              },
              lower: [ customToolTipTopFuel ],
              upper: [ customToolTipBottomFuel ]
            }
          });
        },

        // This rounds the input for numbers entered manually - just incrementers for now
        roundInput = function ($input) {
          var value = parseInt($input.val(), 10),
              min = parseInt($input.data('min'), 10),
              max = parseInt($input.data('max'), 10),
              step = parseInt($input.data('step'), 10),
              mod = value % step,
              populate;

          // Round the value if it needs it
          if (value < min) {
            populate = min;
          } else if (value > max) {
            populate = max;
          } else if (mod !== 0) {
            if (mod >= (step / 2))
              populate = value + (step - mod);
            else
              populate = value - mod;
          } else {
            populate = value;
          }

          $input.val(populate);
        },

        capitalize = function (string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        };

    init();

  })();

});