/*(function ($) {
  Drupal.behaviors.ajaxView = {
    attach: function (context, settings) {
      // Attach ajax action click event of each view column.
      $('.news-archive li a', context).on('click', function(e){
        e.preventDefault();
        const $href = $(this).attr('href');
        

        $.ajax({
            url: Drupal.url($href),
            type: "GET",
            data: { "ajaxCall": true },
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log(response);
                Drupal.attachBehaviors();
            }
        });


      });
    }
  };
})(jQuery);*/