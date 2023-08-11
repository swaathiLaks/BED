//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
const baseUrl = "http://localhost:8081";

function checkIfEmpty(list){
    for (let i = 0; i < list.length; i++) {
        if (list[i] == undefined || list[i] == ""){
            alert("Please fill up all fields!");
            return false;
        }
    }
    return true;
}

$('.login-button').click(function() {
    const username = $(".login-username").val();
    const password = $(".login-password").val();
    var proceed = checkIfEmpty([username, password]);
    if (proceed){
        const requestbody = {username: username, password:password};
        axios.post(`${baseUrl}/login/`, requestbody)
        .then((response)=>{
            var token = response.data.token;
            var userID = response.data.user_id;
            console.log(userID)
            localStorage.setItem("token", token);
            localStorage.setItem("userID", userID);
            console.log(`userID: ${userID}`)
            console.log(response.data)
            window.location.href = "/";
        })
        .catch((error) => {
            console.log(error);
            if (error.response.data =="User doesnt exist"){
                alert("Invalid Username or Password");
            }
        })
    }
    
});

function not_user(){
    const phtml = `<a class="nav-link" href="http://localhost:8082/login">Login</a>`;
    $(".login-login").append($(phtml));
    const lhtml = `<a class="nav-link" href="http://localhost:8082/signup">Sign Up</a>`;
    $(".login-signup").append($(lhtml));
}

$(document).ready(function(){
    const token = localStorage.getItem('token');
    if (token!=null){
        axios.get(`${baseUrl}/isadmin`, {headers: {'Authorization': `Bearer ${token}`}})
        .then(response => {
            if (response.data.isAdmin) {
                const phtml = `<li class="nav-item">
                <a class="nav-link" href="http://localhost:8082/addgame">Add Game</a>
              </li>
              <li class="nav-item">
                    <a class="nav-link" href="http://localhost:8082/addplatform">Add Platform</a>
                </li>`;
                $(".sp-game-nav").append($(phtml));

                $(".shopping-cart-nav").remove();
            }
        })
        .catch(error => console.error(error));

        axios.get(`${baseUrl}/isuser`, {headers: {'Authorization': `Bearer ${token}`}})
        .then(response => {
            if (response.data.isUser) {
                const phtml = `<li class="nav-item"> <a class="nav-link logout" href="http://localhost:8082/login">Log Out</a> </li>`;
                $(".login-login").append($(phtml));
            }
        })
        .catch(error => {
            console.error(error)
            not_user()
        });
    }else{not_user()}

    $(document).on('click', '.logout', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('userID');
        localStorage.removeItem('cart');
        window.location.href = "http://localhost:8082/login"
    });    
})
