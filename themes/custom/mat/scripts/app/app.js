(function($) {
  'use strict';

  // Toggling visibility of the main navigation (on mobile)
  Drupal.behaviors.mobileNavigation = {
    attach: function (context, settings) {
      $('#header .bars', context).once('mobile-navigation').on('click', function() {
        $('body').toggleClass('mobile-menu--opened');
      });
    }
  };

  // Accordion for the main navigation (on mobile)
  Drupal.behaviors.accordionNavigation = {
    attach: function (context, settings) {
      function setAccordion() {
        var windowWidth = $(window).width();

        if (windowWidth < 768) {
          $('#block-mat-main-menu .menu-item--expanded > span, #block-mat-main-menu .menu-item--expanded > a')
                        .attr('aria-expanded', 'false')
                        .attr('role', 'button')
                        .attr('data-toggle', 'collapse')
                        .addClass('collapsed');

          $('#block-mat-main-menu .menu-item--expanded > ul').addClass('collapse')
                                 .attr('data-parent', '#block-mat-main-menu');                

          $('#block-mat-main-menu .menu-item--expanded').each(function(n) {
            $(this).attr('id', 'heading' + n);

            $(this).find('.menu-item--expanded > ul').attr('data-parent', '#heading' + n);

            $(this).find('> span, > a').attr('data-target', '#collapse' + n)
                                       .attr('aria-controls', 'collapse' + n);

            $(this).find('> ul').attr('id', 'collapse' + n)
                                .attr('aria-labelledby', 'heading' + n);
          });
        } else {
          $('#block-mat-main-menu .menu-item--expanded > span, .menu-item--expanded > a').attr('data-toggle', '');
        }
      }

      setAccordion();
      $(window).on('resize', setAccordion);
    }
  };

  // Styling for opened item of the main navigation (on mobile)
  Drupal.behaviors.openItem = {
    attach: function (context, settings) {
      $('#block-mat-main-menu .menu-item--expanded', context).once('opened-item').on('click', function() {
        $(this).siblings().removeClass('menu-item--opened');
        $(this).addClass('menu-item--opened');
      });
    }
  };

})(jQuery);