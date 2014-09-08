define(['app/calculators/' + window.app + '_calculate', 'fastclick', 'magnific', 'iscroll', 'waypoints'], function (calculator) {

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
        $exportables = $('.exportable'),

        // Sliders
        $sliders = $('div.perc-slider'),

        competitor = $toggle.find('button.active').data('compare'), // diesel or gasoline
        purchaseSlider,
        conversionSlider,
        mpgSlider,
        fuelSlider,

        // Variables that are based on viewport
        appWidth = $window.width(),

        init = function () {
          FastClick.attach(document.body);
          
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
                if ($input.parent().hasClass('tooltip-top'))
                  $daSlider.val([value, null]);
                else
                  $daSlider.val([null, value]);
              }
            }

            $body.trigger('changesMade');

          }).on('slidersInitialized', function (e) { // Once the sliders are done, we can get to work
            
            // Do the sticky footer stuff if relevant
            stickyFooter();
            
            // Import data if relevant
            importApp();
            
            // Trigger class made and refresh calculation
            $body.trigger('changesMade');
          }).on('changesMade', function (e) {

            // Update the see results 
            $seeResults.addClass('ready');

            // Refresh the calculation
            calculator.refresh(competitor);
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
            var data = {
              data: JSON.stringify({
                app: window.app,
                results: window.btoa(JSON.stringify(calculator.results())),
                import: exportApp(),
                email: $modal.find('input[type=text]').val()
              })
            };

            e.preventDefault();

            // Make the ajax request
            $.ajax({
              type: 'GET',
              cache: false,
              data: data,
              url: 'http://perc-pdf.local/email.php'
            }).done(function () {
              // trigger thank you
              $modal.find('div.default').hide();
              $modal.find('div.thank-you').show();
            });

          });

          // Close the share modal
          $modal.on('click', 'div.close', function (e) {
            $.magnificPopup.close();
          });

          // See results
          $seeResults.click(function (e) {
            var scrollTo = ($(document).scrollTop() + $.waypoints('viewportHeight') > $resultsSection.offset().top ? $resultsSection.offset().top : $resultsSection.offset().top + $seeResults.outerHeight());

            e.preventDefault();
            $seeResults.removeClass('ready');

            $body.animate({
              scrollTop: scrollTo
            }, 400);
          });

        },

        exportApp = function () {
          var ex = {
            competitor: competitor,
            values: {}
          };

          $exportables.each(function (index, element) {
            var $element = $(element),
                value = $element.val();

            if (typeof value !== 'object') {
              ex.values[$element.attr('id')] = value.replace(/[A-Za-z$-,]/g, "");
            } else {
              ex.values[$element.attr('id')] = [];

              $.each(value, function (i, v) {
                ex.values[$element.attr('id')].push(parseFloat(v.replace(/[A-Za-z$-,]/g, "")));
              });
            }
          });

          return ex;
        },

        importApp = function () {
          var data = getParameter('data');
          
          if (data) {
            data = $.parseJSON(window.atob(data));

            $toggle.find('button').removeClass('active');
            $toggle.find('button[data-compare=' + data.competitor + ']').addClass('active');

            $.each(data.values, function (index, value) {
              $('#' + index).val(value);
            });
          }

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

        getParameter = function (name) {
          name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
          var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
          return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },

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