$(document).ready(function (){
    $('#createuser').on('submit', function(event){
        event.preventDefault();
        const formdata=$(this).serialize();
        $.post('/signup', formdata, function(){
            alert("Signup successfully");
            $('#createuser')[0].reset();
        }).fail(function(){
            alert("Error submitting form");
        })
    })
});