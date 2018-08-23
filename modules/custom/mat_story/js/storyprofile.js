(function ($, Drupal) {

  Drupal.behaviors.mat_story_submission_form = {
    attach: function (context, settings) {

      ///////////////////////////////////////////
      // Submission steps - validation & progress
      ///////////////////////////////////////////

      // Used to validate phone number field.
      var US_phone_number = new RegExp('^(\\([0-9]{3}\\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$');

      // Check if a field is filled out and valid (proper e-mail / phone number format).
      function checkForValidity(field) {
        var isValid = !$(field).parent('.js-form-item').hasClass('invalid');

        if (!$(field).parent('.js-form-item').hasClass('invalid') && ($(field).val() || $(field).val() !== '')) {

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

        return isValid;
      }

      // Validate every field after a user fills it out (moves out of focus) - mostly used for special fields (email etc.)
      $('.node-story-profile-story-submission-form input, .node-story-profile-story-submission-form textarea').bind('focusout', function() {
        if ($(this).val() || $(this).val() !== '') {
          $(this).parent('.js-form-item').removeClass('empty');
          checkForValidity($(this));
        } else {
          $(this).parent('.js-form-item').addClass('empty');
        }
      });

      // For every step, check if all of its inputs meet the validity criteria.
      function hasValidInputs(step) {
        var isValid = true;
        var step_inputs = $(step).find('input, textarea');
        step_inputs.each(function(){
          // If one of the inputs is invalid, return false.
          if(checkForValidity($(this)) === false) {
            isValid = false;
          };
        });
        return isValid;
      }

      // Slide down to the next step.
      function goToByScroll(next_step) {
        next_step = next_step.replace('link', '');
        $('html, body', context).once().animate({scrollTop: $('.'+next_step).offset().top}, 700);
      }

      $(document).bind('mouseup touchend click keyup', function(e) {
        var step1_progress = false;
        var step2_progress = false;
        var step4_progress = false;

        // Dynamically (on every change/keyup) update the validity status of items that have been marked as invalid/empty (red border, warning).
        $('input, textarea').on('keyup change', function() {
          // Invalid fields.
          if ($(this).parent('.js-form-item').hasClass('invalid')) {
            // E-mail
            if ($(this).is('.form-email') && !$(this).is(':invalid')) {
              $(this).parent('.js-form-item').removeClass('invalid');
            }
            // Phone number
            if ($(this).is('#edit-field-submissioner-phone-number-0-value')) {
              if (US_phone_number.test($(this).val())) {
                $(this).parent('.js-form-item').removeClass('invalid');
              }
            }
          }
          // Empty required fields.
          if ($(this).parent('.js-form-item').hasClass('empty')) {
            if ($(this).val() || $(this).val() !== '') {
              $(this).parent('.js-form-item').removeClass('empty');
            }
          }
          // Empty required fields.
          if (!$(this).val() || $(this).val() === '') {
            $(this).parent('.js-form-item').addClass('empty');
          }
        });

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
        }

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
