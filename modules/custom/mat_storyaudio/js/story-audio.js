(function ($, Drupal) {
  Drupal.behaviors.mat_storyaudio_audio = {
    attach: function (context, settings) {
      $('a.audio-mute', context).on('click', function(e) {
        e.preventDefault();
        $audio_elem = $('.audio-player audio', context);
        if($audio_elem.prop('muted')) {
          $audio_elem.prop('muted', false);
          $(this).removeClass('muted');
          $(this).find('.audio-text').text(Drupal.t('Stop audio'));
        } else {
          $audio_elem.prop('muted', true);
          $(this).addClass('muted');
          $(this).find('.audio-text').text(Drupal.t('Play audio'));
        }
      });
    }
  };
})(jQuery, Drupal);