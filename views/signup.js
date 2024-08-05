$(document).ready(function (){
    $('#createuser').on('submit', function(event){
        event.preventDefault();
        const formdata=$(this).serialize();
        $('#error-message').text('');
        $.post('/signup', formdata, function (data) {
            alert(data.message);
            $('#createuser')[0].reset(); 
          })
        .fail(function(msg){
            const resErr = msg.responseJSON;
            if (resErr && resErr.error) {
            $('#error-message').text(resErr.error);
            } else {
            alert('Error submitting form');
            }
        })
    })
});