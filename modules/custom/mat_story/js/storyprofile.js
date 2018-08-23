(function ($, Drupal) {

  Drupal.behaviors.mat_story_submission_form = {
    attach: function (context, settings) {

      ///////////////////////////////////////////
      // Submission steps - validation & progress
      ///////////////////////////////////////////

      function checkForValidity(field) {
        var isValid = true;
        var US_phone_number = new RegExp('^(\\([0-9]{3}\\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$');

        if ($(field).val() || $(field).val() !== '') {

          // Retest an already invalid field
          if ($(field).parent('.js-form-item').hasClass('invalid')) {
            // E-mail
            if ($(field).is('.form-email') && !$(field).is(':invalid')) {
              $(field).parent('.js-form-item').removeClass('invalid');
            }
            // Phone number
            if ($(field).is('#edit-field-submissioner-phone-number-0-value')) {
              if (US_phone_number.test($(field).val())) {
                $(field).parent('.js-form-item').removeClass('invalid');
              }
            }
          }
          // Test a field that has been un-focused (not yet invalid)
          else {
            // Invalid field (for now just the e-mail field).
            if ($(field).is('.form-email')) {
              if ($(field).is(':invalid')) {
                $(field).parent('.js-form-item').addClass('invalid');
                isValid = false;
              } else {
                $(field).parent('.js-form-item').removeClass('invalid');
              };
            }

            // Test phone number for proper format (US).
            if ($(field).is('#edit-field-submissioner-phone-number-0-value')) {
              if (!US_phone_number.test($(field).val())) {
                $(field).parent('.js-form-item').addClass('invalid');
                isValid = false;
              } else {
                $(field).parent('.js-form-item').removeClass('invalid');
              }
            }
          }

        }

        return isValid;
      }

      $('.node-story-profile-story-submission-form input, .node-story-profile-story-submission-form textarea').bind('focusout', function() {
        checkForValidity($(this));
      });


      function hasValidInputs(step) {
        var isValid = true;
        var step_inputs = $(step).find('input, textarea');

        step_inputs.each(function(){
          isValid = checkForValidity($(this));
        });

        return isValid;
      }

      function goToByScroll(next_step) {
        next_step = next_step.replace('link', '');
        $('html, body', context).once().animate({scrollTop: $('.'+next_step).offset().top}, 700);
      }

      $(document).bind('mouseup touchend click keyup', function(e) {

        var step1_progress = false;
        var step2_progress = false;
        var step4_progress = false;

        /*---STEP 1---*/
        var step1_field1 = $('input#edit-field-story-first-name-0-value', context);
        var step1_field2 = $('input#edit-field-story-last-name-0-value', context);
        var step1_field3 = $('input[name="field_story_category"]:checked', context);

        // On click of radio button check if other two fields have a value.
        if (step1_field3.val()) {
          step1_field1.val() && step1_field2.val() ? step1_progress = true : step1_progress = false;
        }

        if (step1_progress == true && !$('.step2 .step-link', context).hasClass('active') && hasValidInputs($('.step1'))) {
          $('.step2 .step-link', context).addClass('active');
          $('.step2 .step-content', context).slideDown();
          goToByScroll('step2');
        }

        /*---STEP 2---*/
        var step2_field1 = $('textarea#edit-body-0-value', context);
        step2_field1.val() !== '' ? step2_progress = true : step2_progress = false;

        if (step2_progress == true && !$('.step3 .step-link', context).hasClass('active') && hasValidInputs($('.step2'))) {
          $('.step3 .step-link', context).addClass('active');
          $('.step3 .step-content', context).slideDown();
         }

        /*---STEP 3---*/
        var step3_field1 = $('input[name="files[field_story_featured_image_0]"]', context);
        step3_field1.on('change', function() {
          if (!$('.step4 .step-link', context).hasClass('active') && hasValidInputs($('.step3'))) {
            $('.step4 .step-link', context).addClass('active');
            $('.step4 .step-content', context).slideDown();
          }
        });

        /*---STEP 4---*/
        var step4_field1 = $('input#edit-field-submissioner-first-name-0-value', context);
        var step4_field2 = $('input#edit-field-submissioner-last-name-0-value', context);
        var step4_field3 = $('input#edit-field-submissioner-email-0-value', context);
        var step4_field4 = $('input#edit-field-submissioner-phone-number-0-value', context);

        step4_field1.val() && step4_field2.val() && step4_field3.val() && step4_field4.val() ? step4_progress = true : step4_progress = false;
        if (step4_progress == true && !$('.step5 .step-link', context).hasClass('active') && hasValidInputs($('.step4'))) {
          $('.step5 .step-link', context).addClass('active');
          $('.step5 .step-content', context).slideDown();
          goToByScroll('step5');
        }

        $('.invalid input, .invalid textarea').on('keyup change', function() {
          checkForValidity($(this));
        });

      });


      // submit
      //$('#node-story-profile-story-submission-form input[type="submit"]', context).val('Submit your story');
      // input title
      $('#node-story-profile-story-submission-form input#edit-field-story-first-name-0-value', context).on('change', function() {
        $('#node-story-profile-story-submission-form  input#edit-title-0-value', context).val($(this).val());
      });
      $('#node-story-profile-story-submission-form input#edit-field-story-last-name-0-value', context).on('change', function() {
        const $val1 = $('#node-story-profile-story-submission-form input#edit-field-story-first-name-0-value', context).val();
        const $val2 = $(this).val();
        $('#node-story-profile-story-submission-form input#edit-title-0-value', context).val($val1 + ' ' + $val2);
      });
      
      // step content
      $('.step-content', context).each(function(){
        const $step_title = $(this).find('h2').text();
        $(this).parent().find('.step-link').append(' <span class="step-title">'+$step_title+'</span>');
      });

      // accordion
      $('.node-story-profile-story-submission-form > .field-group-accordion-wrapper:eq(0) a.step-link', context).addClass('active').next().slideDown();
      /*
      DO NOT DELETE - MAYBE WE'LL NEED THIS AGAIN
      $('.node-story-profile-story-submission-form a.step-link', context).on('click', function(e) {
        var dropDown = $(this).closest('.field-group-accordion-wrapper').find('.step-content');
        $(this).closest('.node-story-profile-story-submission-form').find('.step-content').not(dropDown).slideUp();
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
        } else {
          $(this).closest('.node-story-profile-story-submission-form').find('a.step-link.active').removeClass('active');
          $(this).addClass('active');
        }
        dropDown.stop(false, true).slideToggle();
        e.preventDefault();
      });*/

      // $('.node-story-profile-story-submission-form a.step-link', context).on('click', function(e) {
      //   $(this).addClass('active');
      //   $(this).next('.step-content').slideDown();
      // });

      // Select all step links (except the first one, since it remains open anyway).
      var step_links = $('a.step-link:not([href="#step1"])', context);
      // Open parent div and scroll down.
      step_links.on('click touchend', function() {
        var selected = $(this);
        if (!selected.hasClass('active')) {
          selected.addClass('active');
          selected.next('.step-content').slideDown();
          $('html, body', context).animate({scrollTop: selected.offset().top}, 700);
        }
      });

      // move button to step 5
      $('.node-story-profile-story-submission-form #edit-actions', context).appendTo('.step5-content');

    }
  };
})(jQuery, Drupal);
