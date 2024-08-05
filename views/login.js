$(document).ready(function (){
    $('#loginuser').on('submit', function(event){
        event.preventDefault();
        const formdata=$(this).serialize();
        $('#error-message').text('');
        $.post('/login', formdata, function (data) {
            alert(data.message);
            $('#loginuser')[0].reset(); 
          })
        .fail(function(xhr){
            const resErr = xhr.responseJSON;
            if (resErr && resErr.error) {
            $('#error-message').text(resErr.error);
            } else {
            alert('Error submitting form');
            }
        })
    })
});