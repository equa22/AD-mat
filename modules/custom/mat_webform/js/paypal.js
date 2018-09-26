(function ($, Drupal) {

  Drupal.behaviors.paypal_form = {
    attach: function (context, settings) {
      var inHonorOfRadios = $('#edit-i-am-donating-in-honor-of-a- input[type="radio"]', context);
      var inHonorOfTextbox = $('.form-item-the-person', context);
      inHonorOfRadios.click(function() {
        if (inHonorOfTextbox.css('display') === 'none') {
          inHonorOfTextbox.slideDown();
        }
        inHonorOfTextbox.children('#edit-the-person').focus();
      });

    }
  };

})(jQuery, Drupal);
