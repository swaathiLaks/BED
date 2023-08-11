//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
const token = localStorage.getItem('token');

$(document).ready(function(){
    if (token!=null){
        axios.get(`${baseUrl}/isadmin`, {headers: {'Authorization': `Bearer ${token}`}})
        .catch(error => {
            window.location.href = "http://localhost:8082/login";
                alert("Please login first.")
        }); 
    }else{
        window.location.href = "http://localhost:8082/login";
        alert("Please login first.")
    }
})

$('.ap-create').click(function() {
    var proceed = checkIfEmpty([$('.ap-name').val(),$('.ap-desc').val()])
    if(proceed){
        axios.post(`${baseUrl}/platform/`, {platform_name:$('.ap-name').val(), description:$('.ap-desc').val()}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(response => {alert('Creation successful!'); location.reload();})
        .catch(error =>{
            if (error.response && error.response.status === 422){
                alert('Platform exists.')
            }else{
                console.log(error)
            }
        })
    }

})