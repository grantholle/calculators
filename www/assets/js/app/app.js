define(['app/calculate', 'fastclick', 'magnific', 'slider'], function(calculate) {

  var mow_app = (function () {

    var $toggle = $('div.toggle-group'),
        $increment = $('div.increment-input'),
        $shareBtn = $('a#share-button'),
        $tabs = $('div.tabbed'),
        $compareLabel = $('.compare'),

        // Sliders
        $sliders = $('div.perc-slider'),
        $competitorSlider = $('div#competitor-mower-slider'),
        $propaneSlider = $('div#propane-mower-slider'),
        $fuelSlider = $('div#price-per-gallon'),

        competitor = $toggle.find('button.active').data('compare'), // should we store this? Idk

        bindings = function () {

          // Toggle buttons
          $toggle.on('click', 'button', function (e) {
            $target = $(e.currentTarget);

            if (!$target.hasClass('active')) {
              // swap labels
              competitor = $target.data('compare');
              $compareLabel.html(competitor);

              $toggle.find('button.active').removeClass('active');
              $target.addClass('active');
            }
          });

          // Increment/decrement
          $increment.on('click', 'button', function (e) {
            var $input = $(e.currentTarget).parent().find('input[type=text]'),
                value = parseInt($input.val(), 10),
                change = parseInt($(e.currentTarget).data('value'), 10),
                newVal = value + change,
                populate = (newVal > 0) ? newVal : $input.data('default');

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
          $shareBtn.magnificPopup();

        },

        swapCompetitor = function () {

        };

        sliders = function () {
          // Tool tip action
          var customToolTipTop = $.Link({
            target: '-tooltip-<div class="tooltip-top"></div>',
            method: function ( value ) {

              // The tooltip HTML is 'this', so additional
              // markup can be inserted here.
              $(this).html(
                '<span class="value">$' + value + '</span>' +
                '<span class="label">Per Mower</span>'
              );
            }
          });
          
          var customToolTipTopFuel = $.Link({
            target: '-tooltip-<div class="tooltip-top"></div>',
            method: function ( value ) {

              // The tooltip HTML is 'this', so additional
              // markup can be inserted here.
              $(this).html(
                '<span class="value">$' + value + '</span>' +
                '<span class="label">Propane</span>'
              );
            }
          });
          
          var customToolTipBottomFuel = $.Link({
            target: '-tooltip-<div class="tooltip-bottom"></div>',
            method: function ( value ) {

              // The tooltip HTML is 'this', so additional
              // markup can be inserted here.
              $(this).html(
                '<span class="label">Diesel</span>' +
                '<span class="value">$' + value + '</span>'
              );
            }
          });

          // Sliders
          // Competitor mower purchase
          $competitorSlider.noUiSlider({
            start: 40,
            range: {
              'min': 0,
              'max': 100
            },
            serialization: {
              lower: [ customToolTipTop ]
            }
          });

          // Propane mower purchase
          $propaneSlider.noUiSlider({
            start: 40,
            range: {
              'min': 0,
              'max': 100
            },
            serialization: {
              lower: [ customToolTipTop ]
            }
          });

          // Price per gallon
          $fuelSlider.noUiSlider({
            start: [1.50, 3.94],
            range: {
              'min': 0,
              'max': 5
            },
            serialization: {
              lower: [ customToolTipTopFuel ],
              upper: [ customToolTipBottomFuel ]
            }
          });
        };

    bindings();

  })();

});