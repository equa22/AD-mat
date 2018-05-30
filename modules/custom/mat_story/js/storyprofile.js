(function ($, Drupal) {
  Drupal.behaviors.mat_story_submission_form = {
    attach: function (context, settings) {
      $('#edit-title-wrapper', context).show();
      $('#node-story-profile-story-submission-form input#edit-field-story-first-name-0-value', context).on('change', function() {
        $('#node-story-profile-story-submission-form  input#edit-title-0-value', context).val($(this).val());
      });
      $('#node-story-profile-story-submission-form input#edit-field-story-last-name-0-value', context).on('change', function() {
        const $val1 = $('#node-story-profile-story-submission-form input#edit-field-story-first-name-0-value', context).val();
        const $val2 = $(this).val();
        $('#node-story-profile-story-submission-form input#edit-title-0-value', context).val($val1 + ' ' + $val2);
      });
    }
  };
})(jQuery, Drupal);