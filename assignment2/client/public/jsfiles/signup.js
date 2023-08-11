//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
$(document).ready(function() {
    $(".signup-form").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            url: {
                required: true,
                url: true
            }
        }
    });
});

$('.signup-but').click(function(event){
    event.preventDefault();
    if ($(".signup-form").valid()) {
        var proceed = checkIfEmpty([$('.susername').val(),$('.semail').val(),$('.spassword').val(),$('.surl').val()]);
        if (proceed){
            axios.post(`${baseUrl}/users`, {username:$('.susername').val(), email:$('.semail').val(), password:$('.spassword').val(), type:'Customer', profile_pic_url:$('.surl').val()})
            .then(response =>{
                alert('Thank you for signing up with us!\nYou will now be redirected to the login page. Please use your new login credentials.🦈💖')
                window.location.href = "http://localhost:8082/login";
            })
            .catch((error)=> {
                if (error.response && error.response.status === 422){
                    alert('Email or username provided already exists')
                }else{
                    console.log(error)
                }
            })
        }
    }
})
