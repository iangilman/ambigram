(function() {

  // ----------
  window.App = {
    // ----------
    init: function() {
      var self = this;

      var $img = $('img');

      var superGif = new SuperGif({
        gif: $img[0],
        progressbar_height: 2,
        progressbar_foreground_color: '#acf'
      });

      superGif.load(function() {
        self.initInteraction(superGif);
      });
    },

    // ----------
    initInteraction: function(superGif) {
      var $canvas = $(superGif.get_canvas());
      var $window = $(window);
      var drag;

      $window.on('mousedown', function(event) {
        drag = {
          lastX: event.clientX
        };

        superGif.pause();
      });

      $window.on('mousemove', function(event) {
        if (!drag) {
          return;
        }

        var diffX = event.clientX - drag.lastX;
        var factor = 0.1;
        var move = Math.round(diffX * factor);
        if (move > 0) {
          move = Math.max(1, move);
        } else if (move < 0) {
          move = Math.min(-1, move);
        }

        drag.lastX = event.clientX;
        var frame = superGif.get_current_frame();
        var length = superGif.get_length();
        if (move > 0) {
          frame = (frame + move) % length;
        } else if (move < 0) {
          frame += move;
          while (frame < 0) {
            frame += length;
          }
        }

        superGif.move_to(frame);
      });

      $window.on('mouseup', function() {
        drag = null;
        superGif.play();
      });
    }
  };

  // ----------
  $(document).ready(function() {
    App.init();
  });

})();
