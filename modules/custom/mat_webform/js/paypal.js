(function ($, Drupal) {

  function checkForValidity(field) {
    var US_phone_number = new RegExp('^(\\([0-9]{3}\\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$');
    var isValid = !$(field).parent('.js-form-item').hasClass('invalid');

      // Invalid field (for now just the e-mail field).
      if ($(field).is('#edit-email-address')) {
        if ($(field).is(':invalid')) {
          $(field).parent('.js-form-item').addClass('invalid');
          isValid = false;
        } else {
          isValid = true;
          $(field).parent('.js-form-item').removeClass('invalid');
        };
      } else if ($(field).is('#edit-phone-number')) {
        if (!US_phone_number.test($(field).val())) {
          $(field).parent('.js-form-item').addClass('invalid');
          isValid = false;
        } else {
          isValid = true;
          $(field).parent('.js-form-item').removeClass('invalid');
        }
      } else {
        if ($(field).val() === '' || $(field).val() === null) {
          $(field).parent('.js-form-item').addClass('empty');
        } else {
          $(field).parent('.js-form-item').removeClass('empty');
        }
      }

    return isValid;
  }

  Drupal.behaviors.paypal_form = {
    attach: function (context, settings) {

      var stateSelect = $('#edit-state-state-province', context);
      var giftNoticeTextFields = $('#edit-gift-notice-info input', context);
      var giftNoticeStateSelect = $('#edit-notice-state-state-province', context);
      var requiredFieldsTop = $('#edit-your-information input:required, #edit-your-information select:required', context);

      // Donating in honor of: focus on the textfield once a radio is selected.
      var donationRadios = $('#edit-donation-amount-radios input[type="radio"]', context);
      var inHonorOfRadios = $('#edit-i-am-donating-in-honor-of-a- input[type="radio"]', context);
      var amountSection = $('#edit-donation-amount-radios', context);
      var inHonorSection = $('#edit-i-am-donating-in-honor-of-a-', context);

      var inHonorOfTextbox = $('.form-item-the-person', context);
      var inHonorOfLabel = inHonorOfTextbox.children('#edit-the-person');
      inHonorOfRadios.click(function() {
        if (inHonorOfTextbox.css('display') === 'none') {
          inHonorOfTextbox.slideDown();
        }
        inHonorOfLabel.focus();
      });
      inHonorOfLabel.blur(function() {
        var unchecked = true;
        inHonorOfRadios.each(function() {
          if ($(this).prop('checked')) {
            unchecked = false;
          }
        })
        if (unchecked) {
          $(this).siblings('label').removeClass('labelfocus');
        }
      });

      // Select drop down change event
      $(stateSelect, giftNoticeStateSelect).change(function() {
        checkForValidity($(this));
      });

      // Radio button change event (remove empty class)
      donationRadios.click(function() {
        amountSection.removeClass('empty');
      });
      inHonorOfRadios.click(function() {
        inHonorSection.removeClass('empty');
      });


      // On click of the 'Same as your information above' checkbox, populate fields below.
      var sameInformationCheckbox = $('input[name="same_as_your_information_above"]', context);
      sameInformationCheckbox.click(function(e) {

       var checked = $(this).prop('checked');
       var fieldsAtTheTopAreValid = true;

        requiredFieldsTop.each(function() {
         if (!checkForValidity($(this))) {
           fieldsAtTheTopAreValid = false;
           return;
         }
        })

       if (checked) {
         // If fields at the top are not valid.
         if (!fieldsAtTheTopAreValid) {
           $('html, body', context).animate({scrollTop: $('#edit-your-information').offset().top - 200}, 500);
           e.preventDefault();
         } else {
           // Text fields
           giftNoticeTextFields.each(function(){
             var thisName = $(this).attr('name');
             var otherName = thisName.substr('notice_'.length);
             var otherField = $('#edit-your-information input[name="' + otherName + '"]', context);
             $(this).focus().val(otherField.val()).blur();
           });
           // State select drop-down
           giftNoticeStateSelect.val($('#edit-your-information #edit-state-state-province', context).val());
           checkForValidity(giftNoticeStateSelect);
         }

       } else {
         giftNoticeTextFields.each(function(){
           $(this).siblings('label').removeClass('labelfocus');
           $(this).val(null);
         });
         giftNoticeStateSelect.val(null);
       }

      });

      // On focus out, provide a warning if a required field is not filled out.
      var requiredFields = $('#webform-submission-paypal-donation-form-paragraph-149-add-form input:required, ' +
        '#webform-submission-paypal-donation-form-paragraph-149-add-form select:required', context);

      requiredFields
        .blur(function(){
          checkForValidity($(this));
        })
        .bind('touchend keyup', function() {
          checkForValidity($(this));
        });

      // Main submit button
      var submitButton = $('#edit-actions-submit', context);

      submitButton.click(function(e) {
        var inputsValid = true;
        var donationChecked = false;
        var inHonorChecked = false;
        var infoSection = $('#edit-your-information', context);

        donationRadios.each(function() {
          if ($(this).prop('checked') === true) {
            donationChecked = true;
          };
        });
        if (!donationChecked) {
          amountSection.addClass('empty');
        }

        inHonorOfRadios.each(function() {
          if ($(this).prop('checked') === true) {
            inHonorChecked = true;
          };
        });
        if (!inHonorChecked) {
          inHonorSection.addClass('empty');
        }

        requiredFieldsTop.each(function() {
          checkForValidity($(this));
          if (!checkForValidity($(this))) {
            inputsValid = false;
            return;
          }
        })

        if (!inputsValid) {
          $('html, body', context).animate({scrollTop: infoSection.offset().top - 200}, 500);
          e.preventDefault();
        } else if (!donationChecked) {
          amountSection.addClass('empty');
          $('html, body', context).animate({scrollTop: amountSection.offset().top - 200}, 500);
          e.preventDefault();
        } else if (!inHonorChecked) {
          inHonorSection.addClass('empty');
          $('html, body', context).animate({scrollTop: inHonorSection.offset().top - 200}, 500);
          e.preventDefault();
        }

      });

    }
  };

})(jQuery, Drupal);
