document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('createuser').addEventListener('submit', function(event) {
        event.preventDefault();

        const data={
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value,
        }
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = '';

        axios.post('/signup', data)
            .then(function(response) {
                alert(response.data.message);
                document.getElementById('createuser').reset();
            })
            .catch(function(error) {
                if (error.response && error.response.data.error) {
                    errorMessage.textContent = error.response.data.error;
                } else {
                    alert('Error submitting form');
                }
            });
    });
});
