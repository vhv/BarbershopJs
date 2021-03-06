(function($) {

  "use strict";

  /*
  barbershopjs
  */

  $.fn.barbershop = function() {

    var that = this;

    var initSortable = function() {
      $(that).sortable({
        axis: "y",
        cursor: "move",
        items: "[contenteditable], .ody-image-placeholder"
      });
    }

    var initDraggable = function() {
      $(".bs-element").draggable({
        start: function() {
          initOverlay();
        },
        stop: function(e) {
          $(e.target)
            .css({
              left: "auto",
              top: "auto"
            })

        }
      });
    }


    $(that).find("[contenteditable]").each(function() {
      $(this).attr("data-uuid", uuid());
    });
    $(that).find(".ody-image-placeholder").each(function() {
      $(this).attr("data-uuid", uuid());
    });

    $(that)
      .css({
        position: "relative"
      })
      .append('<div id="bs-editor-overlay" style="position: absolute!important;top:0;left:0;width: 100%;height: 100%;background: transparent;z-index:-1"></div>');

    initSortable();
    initDraggable();
    $(that).droppable({});

    $("body").on("mouseover", "[contenteditable]", function() {
      $(this).css({
        cursor: ($(document.activeElement).data("uuid") === $(this).data("uuid")) ? "text" : "move"
      });
    });

    $(that).find("[contenteditable]")
    /* mouse down */
    .on("mousedown", function() {
      if ($(document.activeElement).data("uuid") === $(this).data("uuid")) {
        console.log("active element  = mousedown element");
        $(that).sortable("sort");
        $(that).sortable("destroy");
      } else {
        initSortable();
        console.log("active element  != mousedown element");
        console.log("active element = #" + $(document.activeElement).attr("id"));
      }
    })
    /* mouse up */
    .on("mouseup", function() {
      $(that).sortable("sort");
      $(that).sortable("destroy");
    })
    /* click */
    .on("click", function() {
      $(this).trigger("focus");
      $(this).css({
        cursor: "text"
      });
      $(that).sortable("destroy");
      console.log("active element = #" + $(document.activeElement).attr("id"));
    })
    .on("mouseover", function() {
      showMetaBox(this);
    })
    .on("mouseout", function() {
      hideMetaBox(this);
    })

    var initOverlay = function() {
      $("#bs-editor-overlay").droppable({
        over: function(event, ui) {
          if ($(ui.draggable[0]).hasClass("bs-element")) {
            $("#bs-editor-overlay")
              .css({
                background: "hsla(334,85%,52%,.2)",
                "z-index": 8
              })
          }
        },
        out: function(event, ui) {
          $("#bs-editor-overlay")
            .css({
              background: "transparent",
              "z-index": -1
            })
        },
        drop: function(e, ui) {
          $("#bs-editor-overlay")
            .css({
              background: "transparent",
              "z-index": -1
            })

          var draggingElement = $(ui.draggable[0]);
          var newItem;

          if ($(draggingElement).hasClass("bs-element")) {
            $(ui.draggable[0])
              .css({
                left: "auto",
                top: "auto"
              })

            if ($(draggingElement).hasClass("bs-image")) {
              newItem = getNewImagePlaceholderElement();
            } else if ($(draggingElement).hasClass("bs-text")) {
              newItem = getNewPlainTextElement();
            } else {
              newItem = getNewRunningTextElement();
            }
            $(that).append($(newItem));
            $(newItem).focus();
            initSortable();
          }
        }
      });

    }

    $("#button-getHandleBarsTemplate").click(function() {
      alert(getHandlebarsTemplate());
    });

    $("#button-getJSON").click(function() {
      alert(JSON.stringify(getJSONValues()));
    });

    var getNewRunningTextElement = function() {
      return $('<article data-uuid="' + uuid() + '" class="bs-doc-textarea" contenteditable="true" spellcheck="false" class="bs-input-field" data-placeholder="Running text with paragraphs and styles.">');
    }

    var getNewPlainTextElement = function() {
      return $('<h3 data-uuid="' + uuid() + '" class="bs-doc-textarea" contenteditable="plaintext-only" spellcheck="false" class="bs-input-field" data-placeholder="Plain text">');
    }

    var getNewImagePlaceholderElement = function() {
      return $('<div class="ody-image-placeholder"></div>');
    }

    var getJSONValues = function() {
      var jsonData = {};
      $(that).find("[contenteditable], .ody-image-placeholder").each(function() {
        var key = $(this).attr('id') || $(this).data('uuid');
        if ($(this).hasClass("ody-image-placeholder"))
          jsonData[key] = $(this).find("img").attr("src");
        else
          jsonData[key] = $(this).html().replace(/\n/g, "");
      });
      return jsonData;
    }

    var getHandlebarsTemplate = function() {
      var templateData = "";
      $(that).find("[contenteditable], .ody-image-placeholder").each(function() {

        if ($(this).hasClass("ody-image-placeholder"))
          templateData += '<img src="{{' + $(this).data('uuid') + '}}" alt="">\n';
        else
          templateData += '<div>{{' + $(this).data('uuid') + '}}</div>\n';

      });
      return templateData;
    }

    var showMetaBox = function(el) {
      $(that).append(getMetaBox(el));
    }

    var hideMetaBox = function() {
      $("body").remove("#bs-element-metabox");
    }

    var getMetaBox = function(el) {
      var metaBox = $('<div id="bs-element-metabox" contenteditable="plaintext-only">' + $(el).data("uuid") + '</div>');
      metaBox.css({
        top: $(el).position().top - 30,
        left: $(that).css("left")
      });
      return metaBox;
    }
  };

  var uuid = function(separator) {
    var delim = separator || "-";

    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
  };


}(jQuery));