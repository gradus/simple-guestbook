$(document).ready(function() {

  now.showContact = function(contact){
    $('.contacts').prepend("<li>\n<div class='alert alert-success'>\n<p>Name " + $('.full_name').val()  + "</p>\n");
  }

  $('.create_contact').click( function () {
      now.newContact($('.first_name').val() + ' ' + $('.last_name').val() + '<br />' + $('.email').val() + '<br />' + ('.phone').val()  );
  });

});
