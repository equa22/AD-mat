(function ($, Drupal) {
  Drupal.behaviors.mat_stories_api = {
    attach: function (context, settings) {
      console.log('MAT Stories Api Init');
      $.getJSON('/stories-api?_format=json', function(data) {
        console.log(data);
      });
    }
  };
})(jQuery, Drupal);