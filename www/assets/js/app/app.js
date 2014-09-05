define(['fastclick', 'magnific', 'iscroll', 'waypoints'], function () {

  var app = (function () {

    var $toggle = $('div.toggle-group'),
        $shareBtn = $('a#share-button'),
        $increment = $('div.increment-input'),
        $tabs = $('div.tabbed'),
        $body = $('body'),
        $window = $(window),
        $modal = $('div.modal'),
        $qMarks = $('i.icon-tooltip'),
        $currencyField = $('input[type=currency]'),
        $fuelDifference = $('span#fuel-difference'),
        $headerImg = $('header img#header-img'),
        $sendResults = $('a#send-link'),
        $seeResults = $('a.see-results'),
        $resultsSection = $('section#results'),

        // Sliders
        $sliders = $('div.perc-slider'),

        competitor = $toggle.find('button.active').data('compare'), // diesel or gasoline
        purchaseSlider,
        conversionSlider,
        mpgSlider,
        fuelSlider,
        pdfUrl = 'http://perc-pdf-generator.dev01.40digits.net/',
        appUrl = 'http://google.com',

        // Variables that are based on viewport
        appWidth = $window.width(),

        init = function () {
          FastClick.attach(document.body);

          // scrolling = new IScroll('body');
          
          bindings();
        },

        bindings = function () {

          $window.on('resize', function () {
            appWidth = $window.width();
            moveTooltipsAfterResize();
            stickyFooter();
          });

          $resultsSection.waypoint(function (direction) {

            $seeResults.toggleClass('unstick').removeClass('ready');

            if ($seeResults.hasClass('unstick'))
              $resultsSection.css({ paddingTop: 12 });
            else
              $resultsSection.css({ paddingTop: $seeResults.outerHeight() + 12 });
          },
          {
            offset: function () {
              if ($(document).scrollTop() + $.waypoints('viewportHeight') > $resultsSection.offset().top)
                return $.waypoints('viewportHeight');
              else
                return $.waypoints('viewportHeight') - $seeResults.outerHeight();
            }
          });

          // This tricks mobile devices to show html5 number and still allow a dollar sign to populate
          $currencyField.on('touchstart', function (e) {
            var $input = $(e.currentTarget);

            $input.data('original-string', $input.val());
            $input.attr('type', 'number').focus();
          });

          // Toggle buttons
          $toggle.on('click', 'button', function (e) {
            $target = $(e.currentTarget);

            if (!$target.hasClass('active')) {
              swapCompetitor($target);
            }
          });

          // Increment/decrement
          $increment.on('touchstart', 'button', function (e) {
            $(e.currentTarget).addClass('active');
          }).on('touchend, touchcancel, click', 'button', function (e) {
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
            $body.trigger('changesMade');

            $(e.currentTarget).removeClass('active');
          });

          // Trigger calculation after done dragging or moving
          $sliders.on('change', function (e) {
            $body.trigger('changesMade');
          }).on('showToolTips', function (e) { // This is triggered from the plugin to show the tooltips
            $(e.currentTarget).parents('.has-slider').find('.tooltip').show();
          });

          // Tooltips
          $qMarks.click(function (e) {
            var $this = $(e.currentTarget),
                $tool = $this.find('div.tab-tooltip');

            $tool.toggleClass('active');

            if ($tool.offset().top < $window.scrollTop()) {
              $body.animate({
                scrollTop: $tool.offset().top - 10
              }, 400);
            }
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
            } else { // Else change the value of the slider
              var $daSlider = $input.parents('div.slider-wrapper, div.range-wrapper').find('div.perc-slider');

              // Switch changed number fields back to currency before we change the value
              if ($input.attr('type') === 'number')
                $input.attr('type', 'currency');

              // If it's not a range slider
              if (!$daSlider.hasClass('range-slider')) {
                $daSlider.val(value);
              } else { // If it is, we need to know which input changed
                if ($input.parent().hasClass('tooltip-top'))
                  $daSlider.val([value, null]);
                else
                  $daSlider.val([null, value]);

              }
            }

            $body.trigger('changesMade');
          }).on('slidersInitialized', function (e) { // Once the sliders are done, we can get to work
            stickyFooter();
            $body.trigger('changesMade');
          }).on('changesMade', function (e) {
            $seeResults.addClass('ready');
            $body.trigger('refreshCalculation', [competitor]);
          }).on('refreshWaypoint', function () {
            $.waypoints('refresh');
          }).on('moveTooltip', moveTooltip);

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
            showCloseBtn: false,
            callbacks: {
              close: function () {
                $modal.find('input[type=text]').val('');
                $modal.find('div.default').show();
                $modal.find('div.thank-you').hide();
              }
            }
          });

          // Send dat link, yo!
          $sendResults.click(function (e) {
            var link = pdfUrl + '?data=' + window.btoa(JSON.stringify(calculate.results())),
                emails = $modal.find('input[type=text]').val().replace(',', ';').replace(' ', ''),
                mailto = 'mailto:' + emails,
                subject = 'See%20results%20from%20the%20Autogas%20Propane%20Calculator',
                body = 'A%20FRIEND%20SHARED%20THEIR%20AUTOGAS%20PROPANE%20CALCULATOR%20RESULTS.%0ASomeone%20wants%20you%20to%20know%20about%20the%20cost%20savings%20of%20clean%2C%20American-made%20propane.%20Below%2C%20you%E2%80%99ll%20find%20results%20from%20the%20Autogas%20Propane%20Calculator.%0A%0A' + link + '%0A%0ACALCULATE%20YOUR%20OWN%20COST%20SAVINGS.%0AFind%20out%20how%20much%20propane%20could%20be%20saving%20you%20with%20the%20Autogas%20Propane%20Calculator.%20Follow%20the%20link%20to%20complete%20your%20own%20cost%20comparison%2C%20and%20then%20share%20it%20with%20friends.%0A%0A' + appUrl;

            $(e.currentTarget).attr('href', mailto + '?subject=' + subject + '&body=' + body);
            // e.preventDefault();

            // trigger thank you
            $modal.find('div.default').hide();
            $modal.find('div.thank-you').show();
          });

          // Close the share modal
          $modal.on('click', 'div.close', function (e) {
            $.magnificPopup.close();
          });

          // See results
          $seeResults.click(function (e) {
            e.preventDefault();
            $seeResults.removeClass('ready');

            $body.animate({
              scrollTop: $resultsSection.offset().top + $seeResults.outerHeight()
            }, 400);
          });

        },

        swapCompetitor = function ($target) {
          competitor = $target.data('compare');
          formattedCompetitor = capitalize(competitor);

          // Update toggle buttons
          $toggle.find('button.active').removeClass('active');
          $target.addClass('active');

          // Swap labels
          $body.find('.compare').html(formattedCompetitor);

          // Update slider settings based on new competitor
          $body.trigger('swapCompetitor');

          // Refresh the calculation
          $body.trigger('changesMade');

        },

        moveTooltip = function (e, $tooltip, value, handlePos, $fuelSliderEle) {
          
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
          if ($fuelSliderEle && value) {
            var values = $fuelSliderEle.val(),
                comp, prop, diff;
            
            if (typeof values[1] !== 'undefined') {
              comp = parseFloat(values[1].replace('$', ''));
              prop = parseFloat(values[0].replace('$', ''));
              diff = Math.abs(comp - prop);

              $fuelDifference.html('$' + diff.toFixed(2));
            }
          }

          $body.trigger('refreshWaypoint');
        },

        moveTooltipsAfterResize = function () {
          $sliders.each(function (index, element) {
            var $slider = $(element),
                $sliderOrigin = $slider.find('div.noUi-origin'),
                $tooltips = $slider.parent().find('div.tooltip');

            // If this is true, this is the fuel slider
            if (typeof $slider.find('div.noUi-origin')[1] !== 'undefined') {
              $body.trigger('moveTooltip', [$tooltips.first(), false, $sliderOrigin[0].offsetLeft, false]);
              $body.trigger('moveTooltip', [$tooltips.last(), false, $sliderOrigin[1].offsetLeft, false]);
            } else {
              $body.trigger('moveTooltip', [$tooltips, false, $sliderOrigin[0].offsetLeft, false]);
            }
          });
        },

        stickyFooter = function () {
          if ($body.outerHeight() < $window.outerHeight()) {
            $body.addClass('extend');
          } else {
            $body.removeClass('extend');
          }
        },

        capitalize = function (string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        };

    init();

  })();

});