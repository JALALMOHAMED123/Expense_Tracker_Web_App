$(document).ready(function (){
    $('#loginuser').on('submit', function(event){
        event.preventDefault();
        const formdata=$(this).serialize();
        $('#error-message').text('');
        $.post('/login', formdata, function (data) {
            $('#loginuser')[0].reset();
            if(data.redirect){
                localStorage.setItem("token", data.token);
                window.location.href=data.redirect;
            }
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

$('#forget').on('click', function(){
    $('#forgetpassword').toggle();
});