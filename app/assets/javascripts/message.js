$(function(){
  function buildHTML(message){
    if (message.image) {
      var html = `<div class="message-items">
        <div class="message-items__top" data-message-id="${message.id}>
        <p class="message-items__top__name">
        ${message.user_name}
        </p>
        <p class="message-items__top__date">
        ${message.created_at}
        </p>
        </div>
        <p class="message-items__message">
        ${message.content}
        <img class="messageJ-items__image" src="${message.image}">
        </p>
        </div>`
      return html;
    } else {
      var html = `<div class="message-items">
        <div class="message-items__top" data-message-id="${message.id}>
        <p class="message-items__top__name">
        ${message.user_name}
        </p>
        <p class="message-items__top__date">
        ${message.created_at}
        </p>
        </div>
        <p class="message-items__message">
        ${message.content}
        </p>
        </div>`
      return html;
    };
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main__message-list').append(html);
      $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      $('form')[0].reset();
      $('.submit-btn').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
      $('.submit-btn').prop('disabled', false);
    })
  })

  var reloadMessages = function() {
    var last_message_id = $('.message-items__top:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.chat-main__message-list').append(insertHTML);
        $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    })
  }
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});