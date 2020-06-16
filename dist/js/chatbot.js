$(function () {
  generate_message("Hi! This is Farmbot. How can I help you?", 'self');

  var INDEX = 0;
  $("#chat-submit").click(function (e) {
    e.preventDefault();
    var msg = $("#chat-input").val();
    $('#chat-input').val("");

    if (msg.trim() == '') {
      return false;
    }
    // generate_message(msg, 'self');


    setTimeout(function () {
      generate_message(msg, 'user');
    }, 200)

    setTimeout(function () {
      generate_message("What do you want to know?", 'self');
    }, 1500)


  })

  function generate_message(msg, type) {
    INDEX++;
    var str = "";
    str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
    str += "          <span class=\"msg-avatar\">";
    str += "            <img src=\"dist\/img\/" + type + ".png\">";
    str += "          <\/span>";
    str += "          <div class=\"cm-msg-text\">";
    str += msg;
    str += "          <\/div>";
    str += "        <\/div>";
    $(".chat-logs").append(str);
    $("#cm-msg-" + INDEX).hide().fadeIn(300);
    if (type == 'self') {
      $("#chat-input").val('');
    }
    $(".chat-logs").stop().animate({scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
  }


  $(document).delegate(".chat-btn", "click", function () {
    var value = $(this).attr("chat-value");
    var name = $(this).html();
    $("#chat-input").attr("disabled", false);
    generate_message(name, 'self');
  })

  $("#chat-circle").click(function () {
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
  })

  $(".chat-box-toggle").click(function () {
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
  })

})
