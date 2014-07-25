define(['app/calculate', 'fastclick', 'magnific', 'slider'], function(calculate) {

  var mow_app = (function () {

    var $toggle = $('div.toggle-group'),
        $increment = $('div.increment-input'),
        $shareBtn = $('a#share-button'),
        $tabs = $('div.tabbed'),
        $body = $('body'),
        $modal = $('div.modal'),

        // Sliders
        $sliders = $('div.perc-slider'),
        $competitorSliderEle = $('div#competitor-mower-slider'),
        $propaneSliderEle = $('div#propane-mower-slider'),
        $fuelSliderEle = $('div#price-per-gallon'),

        competitor = $toggle.find('button.active').data('compare'), // should we store this? Idk
        competitorSlider,
        propaneSlider,
        fuelSlider,

        bindings = function () {

          $sliders.on('click', 'input', function (e) {
            e.preventDefault();
            e.stopPropagation();
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
                populate = (newVal >= min && newVal <= max) ? newVal : $input.data('default');

            $input.val(populate);
          });

          // Sliders
          sliders();

          // Trigger calculation after done dragging or moving
          $sliders.on('change', function (e) {
            console.log('Do it!');
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

          $modal.on('click', 'div.close', function (e) {
            $.magnificPopup.close();
          });

        },

        swapCompetitor = function ($target) {
          var mower_range = $target.data('mower-range'),
              fuel_range = $target.data('fuel-range');

          competitor = $target.data('compare');

          // Swap labels
          $body.find('.compare').html(competitor);

          // Update slider settings based on new competitor


          // Update toggle buttons
          $toggle.find('button.active').removeClass('active');
          $target.addClass('active');
        },

        sliders = function () {
          // Tool tip action
          var customToolTipTop = $.Link({
            target: '-tooltip-<div class="tooltip-top"></div>',
            method: function ( value ) {
              $(this).html(
                '<span class="value">' + value + '</span>' +
                '<span class="label">Per Mower</span>'
              );
            }
          });
          
          var customToolTipTopFuel = $.Link({
            target: '-tooltip-<div class="tooltip-top"></div>',
            method: function ( value ) {
              $(this).html(
                '<span class="value">' + value + '</span>' +
                '<span class="label">Propane</span>'
              );
            }
          });
          
          var customToolTipBottomFuel = $.Link({
            target: '-tooltip-<div class="tooltip-bottom"></div>',
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
              lower: [ customToolTipTop ]
            }
          });

          // Propane mower purchase
          propaneSlider = $propaneSliderEle.noUiSlider({
            start: 10500,
            range: {
              min: [7500],
              max: 16500
            },
            step: 50,
            serialization: {
              format: {
                thousand: ',',
                prefix: '$',
                decimals: 0
              },
              lower: [ customToolTipTop ]
            }
          });

          // Price per gallon
          // Upper (index 0) is propane
          // Lower (index 1) is competitor
          var fuel_range = $toggle.find('button.active').data('fuel-range').split(',');
          fuelSlider = $fuelSliderEle.noUiSlider({
            start: [2, parseInt($toggle.find('button.active').data('fuel-default'), 10)],
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

        capitalize = function (string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        };

    bindings();

  })();

});