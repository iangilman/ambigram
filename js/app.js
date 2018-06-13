'use strict';
(function() {

  // ----------
  window.App = {
    // ----------
    init: function() {
      this.$body = $('body');
      this.$rotationSlider = $('.rotation-slider');
      this.$contentArea = $('.content-area');
      this.snap = new Snap(this.$contentArea[0]);

      this.initUI();
      this.initDrop();
    },

    // ----------
    initUI: function() {
      var self = this;

      this.$rotationSlider.on('input', function() {
        var value = self.$rotationSlider.val();
        if (self.mainGroup) {
          self.mainGroup.attr({
            transform: 'rotate(' + value + ', ' + self.mainBounds.cx + ', ' + self.mainBounds.cy + ')'
          });
        }
      });
    },

    // ----------
    initDrop: function() {
      var self = this;

      this.$body.on('dragover', function(event) {
        self.$contentArea.addClass('drag-over');
        event.preventDefault();
        event.stopPropagation();
      });

      this.$body.on('dragleave', function(event) {
        self.$contentArea.removeClass('drag-over');
      });

      this.$body.on('drop', function(event) {
        self.$contentArea.removeClass('drag-over');

        var data = event.originalEvent.dataTransfer;
        if (!data) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        // var where = new OpenSeadragon.Point(event.originalEvent.clientX, event.originalEvent.clientY);

        if (!('FileReader' in window)) {
          alert('This browser doesn\'t support dragging from the desktop');
          return;
        }

        var files = data.files;
        var found = 0;
        var loaded = [];
        _.each(files, function(file, i) {
          if (!file.type.match('svg')) {
            return;
          }

          var reader = new FileReader();
          reader.onload = function(loadEvent) {
            // console.log(loadEvent);
            // console.log(atob(loadEvent.target.result.replace(/^.*base64,/, '')));

            if (self.mainGroup) {
              alert('Only one SVG file at a time for now.');
              return;
            }

            Snap.load(loadEvent.target.result, function(loadedSvg) {
              var style = loadedSvg.select('style');
              var g = loadedSvg.select('g');
              self.snap.append(style);
              self.snap.append(g);
              self.mainGroup = g;
              self.mainBounds = g.getBBox();
            });
          };

          reader.readAsDataURL(file);
          found++;
        });

        if (!found) {
          alert('No SVG files dropped');
        }
      });
    }
  };

  // ----------
  $(document).ready(function() {
    App.init();
  });

})();
