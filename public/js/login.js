$(document).ready(function (){
    $('#loginuser').on('submit', function(event){
        event.preventDefault();
        const formdata=$(this).serialize();
        $('#error-message').text('');
        $.post('/login', formdata, function (data) {
            $('#loginuser')[0].reset();
            if(data){
                localStorage.setItem("token", data.token);
                console.log("token" , data.token);
                window.location.href="/Expense.html";
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

document.getElementById('forgetpassword').addEventListener('submit', function(event){
    event.preventDefault();
    console.log(event.target.email_id.value);
    const user_details={
        email: event.target.email_id.value
    }
    console.log(user_details);
    axios.post('/password/forgotpassword',user_details)
    .then((res)=>{
        document.body.innerHTML +='<div style="color:red">Mail send successfully</div>'
    })
    .catch((err)=>{
        document.body.innerHTML +=`<div style="color:red">${err}</div>`
    })
});