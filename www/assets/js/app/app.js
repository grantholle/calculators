define(['app/calculate', 'fastclick', 'magnific', 'slider'], function (calculate) {

  var mow_app = (function () {

    var $toggle = $('div.toggle-group'),
        $increment = $('div.increment-input'),
        $shareBtn = $('a#share-button'),
        $tabs = $('div.tabbed'),
        $body = $('body'),
        $modal = $('div.modal'),
        $qMarks = $('i.icon-TooltipMark'),
        $currencyField = $('input[type=currency]'),
        $fuelDifference = $('span#fuel-difference'),
        $headerImg = $('header img#header-img'),
        $sendResults = $('a#send-link'),

        // Sliders
        $sliders = $('div.perc-slider'),
        $sliderWrap = $('div.has-slider'),
        $competitorSliderEle = $('div#competitor-mower-slider'),
        $propaneSliderEle = $('div#propane-mower-slider'),
        $fuelSliderEle = $('div#price-per-gallon'),

        // Tooltip inputs
        $competitorMowerPrice = $('input#competitor-mower-price'),
        $propaneMowerPrice = $('input#propane-mower-price'),
        $competitorFuelPrice = $('input#comp-fuel-price'),
        $propaneFuelPrice = $('input#propane-fuel-price'),

        competitor = $toggle.find('button.active').data('compare'), // diesel or gasoline
        competitorSlider,
        propaneSlider,
        fuelSlider,

        // Variables that are based on viewport
        appWidth = $(window).width(),

        init = function () {
          FastClick.attach(document.body);
          responsiveImage();
          
          bindings();

          sliders();


          // Initial calculation
          calculate.refresh(competitor);
        },

        bindings = function () {

          $(window).resize(function () {
            appWidth = $(window).width();
            moveTooltipsAfterResize();
            responsiveImage();
          });

          // This tricks mobile devices to show html5 number and still allow a dollar sign to populate
          $currencyField.on('touchstart', function (e) {
            var $input = $(e.currentTarget);

            $input.data('original-string', $input.val());
            $input.attr('type', 'number');
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
            calculate.refresh(competitor);

          });

          // Trigger calculation after done dragging or moving
          $sliders.on('change', function (e) {
            calculate.refresh(competitor);
          }).on('showToolTips', function (e) { // This is triggered from the plugin to show the tooltips
            $(e.currentTarget).parents('.has-slider').find('.tooltip').show();
          });

          $qMarks.click(function (e) {
            var $this = $(e.currentTarget);

            $this.find('div.tab-tooltip').toggleClass('active');
          });

          // Events for input fields and their behavior on blur and enter
          $body.on('focus', 'input[type=text], input[type=number], input[type=currency]', function (e) {
            var $input = $(e.currentTarget);

            if ($input.val() !== '')
              $input.data('original-string', $input.val());
            
            $input.val('');
          }).on('keypress', 'input[type=text], input[type=number], input[type=currency]', function (e) {
            if (e.keyCode === 13) {
              $(e.currentTarget).blur();
            }
          }).on('blur', 'input[type=text], input[type=number], input[type=currency]', function (e) {
            var $input = $(e.currentTarget),
                value = $input.val().replace('$', '');

            // If the input is empty, reset the input to what it was
            if (value === '') {
              if ($input.parent().hasClass('tooltip')) { // if this is for a slider we need to change the type back
                if ($input.attr('type') === 'number')
                  $input.attr('type', 'currency');
              }

              $input.val($input.data('original-string'));
            } else if ($input.parent().hasClass('increment-input')) { // This is an increment
              roundInput($input);
            } else { // Else change the value of the slider
              var $daSlider = $input.parents('div.slider-wrapper, div.range-wrapper').find('div.perc-slider');

              // Switch changed number fields back to currency before we change the value
              if ($input.attr('type') === 'number')
                $input.attr('type', 'currency');

              // If it's not a range slider
              if (!$daSlider.hasClass('range-slider')) {
                $daSlider.val(value);
              } else { // If it is, we need to know which input changed
                if ($input.parent().hasClass('propane-fuel-price'))
                  $daSlider.val([value, null]);
                else
                  $daSlider.val([null, value]);

              }
            }

            calculate.refresh(competitor);
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

          // Send dat link, yo!
          $sendResults.click(function (e) {
            var encode = window.btoa(JSON.stringify(calculate.results()));

            // $(e.currentTarget).attr('href', '//perc-pdf.local?data=' + encode);
            e.preventDefault();
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
          formattedCompetitor = capitalize(competitor);

          // Update toggle buttons
          $toggle.find('button.active').removeClass('active');
          $target.addClass('active');

          // Swap labels
          $body.find('.compare').html(formattedCompetitor);

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
            start: [2, parseFloat($toggle.find('button.active').data('fuel-default'))],
            range: {
              min: 1.25,
              max: 5
            }
          }, true);

          // Refresh the calculation
          calculate.refresh(competitor);

        },

        sliders = function () {

          // Tool tip action
          var customToolTipCompetitor = $.Link({
            target: function (value, a, b) {
              moveTooltip($competitorMowerPrice.parent(), value, a[0].parentNode.offsetLeft);
            }
          }),
          
          customToolTipPropane = $.Link({
            target: function (value, a, b) {
              moveTooltip($propaneMowerPrice.parent(), value, a[0].parentNode.offsetLeft);
            }
          }),
          
          customToolTipTopFuel = $.Link({
            target: function (value, a, b) {
              moveTooltip($propaneFuelPrice.parent(), value, a[0].parentNode.offsetLeft, true);
            }
          }),
          
          customToolTipBottomFuel = $.Link({
            target: function (value, a, b) {
              moveTooltip($competitorFuelPrice.parent(), value, a[0].parentNode.offsetLeft, true);
            }
          });

          // Sliders
          // Competitor mower purchase
          var competitor_range = $toggle.find('button.active').data('mower-range').split(',');
          competitorSlider = $competitorSliderEle.noUiSlider({
            start: parseInt($toggle.find('button.active').data('mower-default'), 10),
            connect: 'lower',
            behaviour: 'snap',
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
            behaviour: 'snap',
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
            start: [2, parseFloat($toggle.find('button.active').data('fuel-default'))],
            behaviour: 'snap',
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

        moveTooltip = function ($tooltip, value, handlePos, isFuel) {
          
          // If we're changing the value (not a window resize)
          if (value)
            $tooltip.find('input').val(value);

          if (appWidth <= 400) {
            $tooltip.css('left', handlePos);
          } else if (appWidth < 768) {
            $tooltip.css('left', handlePos + 1);
          } else {
            $tooltip.css('left', handlePos + 6);
          }

          // If it's fuel and we're changing the value (not a window resize)
          if (isFuel && value) {
            var values = $fuelSliderEle.val(),
                comp, prop, diff;
            
            if (typeof values[1] !== 'undefined') {
              comp = parseFloat(values[1].replace('$', ''));
              prop = parseFloat(values[0].replace('$', ''));
              diff = Math.abs(comp - prop);

              $fuelDifference.html('$' + diff.toFixed(2));
            }
          }
        },

        moveTooltipsAfterResize = function () {
          $sliders.each(function (index, element) {
            var $slider = $(element),
                $sliderOrigin = $slider.find('div.noUi-origin'),
                $tooltips = $slider.parent().find('div.tooltip');

            // If this is true, this is the fuel slider
            if (typeof $slider.find('div.noUi-origin')[1] !== 'undefined') {
              moveTooltip($tooltips.first(), false, $sliderOrigin[0].offsetLeft, false);
              moveTooltip($tooltips.last(), false, $sliderOrigin[1].offsetLeft, false);
            } else {
              moveTooltip($tooltips, false, $sliderOrigin[0].offsetLeft, false);
            }
          });
        },

        // This rounds the input for numbers entered manually - just incrementers/spinner
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

        responsiveImage = function () {
          var src = $headerImg.attr('src'),
              small = $headerImg.data('small'),
              large = $headerImg.data('large');

          if (appWidth < 768 && src !== small) {
            $headerImg.attr('src', small);
          } else if (appWidth >= 768 && src !== large) {
            $headerImg.attr('src', large);
          }
        },

        capitalize = function (string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        };

    init();

  })();

});