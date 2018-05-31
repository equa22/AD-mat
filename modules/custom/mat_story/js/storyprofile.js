(function ($, Drupal) {
  Drupal.behaviors.mat_story_submission_form = {
    attach: function (context, settings) {
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
      });

    }
  };
})(jQuery, Drupal);