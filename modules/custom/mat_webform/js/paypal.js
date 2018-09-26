(function ($, Drupal) {

  Drupal.behaviors.paypal_form = {
    attach: function (context, settings) {
      // Donating in honor of: focus on the textfield once a radio is selected.
      var inHonorOfRadios = $('#edit-i-am-donating-in-honor-of-a- input[type="radio"]', context);
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

      // On click of the 'Same as your information above' checkbox, populate fields below.
      var sameInformationCheckbox = $('input[name="same_as_your_information_above"]', context);
      sameInformationCheckbox.change(function() {
       var checked = $(this).prop('checked');
       var giftNoticeTextFields = $('#edit-gift-notice-info input', context);
       var giftNoticeStateSelect = $('#edit-gift-notice-info #edit-notice-state-state-province', context);

       if (checked) {
         // Text fields
         giftNoticeTextFields.each(function(){
          var thisName = $(this).attr('name');
          var otherName = thisName.substr('notice_'.length);
          var otherField = $('#edit-your-information input[name="' + otherName + '"]', context);
          $(this).focus().val(otherField.val()).blur();
        });
        // State select drop-down
         giftNoticeStateSelect.val($('#edit-your-information #edit-state-state-province', context).val());
       } else {
         giftNoticeTextFields.each(function(){
           $(this).siblings('label').removeClass('labelfocus');
           $(this).val(null);
         });
         giftNoticeStateSelect.val(null);
       }

      });

    }
  };

})(jQuery, Drupal);
