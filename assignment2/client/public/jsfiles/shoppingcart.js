//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
function notuser(){
    window.location.href = "http://localhost:8082/login"
    alert("Please login first.");
}

function checkIfEmpty(e){
    e.preventDefault();
    var formData = $('.payment-form').find(':input').map(function() {
        return {
            name: this.name,
            value: this.value
        };
    }).get();

    for (let i = 0; i < formData.length; i++) {
        if (formData[i].value == "" && formData[i].name != "check-out-but") {
            alert("Please fill up all fields!");
            return false;
        }
        if (formData[i].name == "postal-code" || formData[i].name == "card-number" || formData[i].name == "cvv") {
            if (!$.isNumeric(formData[i].value)) {
                alert("Please only use numerical values for the postal code, card number and cvv.");
                return false;
            }
        }
        if (formData[i].name=="date"){
            if (!/^\d{2}\/\d{2}$/.test(formData[i].value)) {
                alert("Date must be in the format mm/yy!");
                return false;
            }
            var parts = formData[i].value.split("/");
            var month = parseInt(parts[0]);
            var year = parseInt(parts[1]);
            if (month < 1 || month > 12) {
                alert("Please enter valid month.");
                return false;
            }
            if (year < 0 || year > 99) {
                alert("Please enter valid year.");
                return false;
            }
        }
    }
    const userID = localStorage.getItem('userID');
    var cart = JSON.parse(localStorage.getItem('cart'));
    const token = localStorage.getItem('token');
    console.log(cart);
    for(i=0;i<cart.length;i++){
        console.log(i);
        var requestbody;
        if (formData.length==8){
            requestbody={gameid:cart[i][0], userid:userID, address_line_1:formData[0].value, address_line_2:formData[1].value, country:formData[2].value, postal:formData[4].value, email_del:formData[5].value, payment_method:formData[6].value, card_number:null, card_name:null, card_expire:null, card_cvv:null, platform_id:cart[i][1], city:formData[3].value}
        }else if (formData.length==12){
            requestbody={gameid:cart[i][0], userid:userID, address_line_1:formData[0].value, address_line_2:formData[1].value, country:formData[2].value, postal:formData[4].value, email_del:formData[5].value, payment_method:formData[6].value, card_number:formData[7].value, card_name:formData[8].value, card_expire:formData[9].value, card_cvv:formData[10].value, platform_id:cart[i][1], city:formData[3].value}
        }

        axios.post(`${baseUrl}/shopping`, requestbody, {headers: {'Authorization': `Bearer ${token}`}})
        .catch(error => {
            console.log(error)
            alert("Sorry there was an error! Your payment was not processed.")
        })
    }   
    
    localStorage.removeItem('cart');
    location.reload()
}

function detect_dropdown(){
    $(".payment-method").empty();
    if ($('.payment-dropdown').val()=="Paynow"){
        var phtml =`<img src="./images/qrcode.png" alt="qrcode" width="222px">`
        $(".payment-method").append($(phtml));
    }else{
        var phtml =`<form class="row g-3">
        <div class="col-md-12">
          <label class="form-label">Card number</label>
          <input name = "card-number"  class="form-control">
        </div>
        <div class="col-md-6">
          <label class="form-label">Name on card</label>
          <input name ="name-on-card" type="text" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">MM/YY</label>
          <input type="text" name="date" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">CVV</label>
          <input type="text" name="cvv" class="form-control">
        </div>
      </form>`
      $(".payment-method").append($(phtml));

    }
    
}

function retrieve_items() {
    const userID = localStorage.getItem('userID');
    axios.get(`${baseUrl}/shopping/${userID}`)
        .then(response => {
            console.log(response.data)
            for (let i = 0; i < response.data.length; i++) {
                (function(i) {
                    axios.get(`${baseUrl}/game/${response.data[i].gameid}/${response.data[i].platform}`)
                        .then(response1 => {
                            let gameInfo = response1.data[0]
                            var phtml = `
                            <div class="card m-3" style="width: 18rem; height: 30rem;">
                            <img style="height:18rem; object-fit: cover; overflow: hidden;" src="data:image/jpeg;base64,${gameInfo.image}"  class="card-img-top m-1" alt="No image">
                            <div class="card-body">
                              <h5 class="card-title">Name: ${gameInfo.title}</h5>
                              <p class="card-text">Platform: ${gameInfo.platform}</p>
                              <p class="card-text">Price: $${parseFloat(gameInfo.price).toFixed(2)}</p>
                              <small class="text-body-secondary">Ordered on: ${response.data[i].created_at}</small>
                            </div>
                          </div>` 
                          $(".display-game").append($(phtml));
                        })
                })(i);
            }
        })
}

$(document).ready(function(){
    const token = localStorage.getItem('token');
    if (token != null){
        axios.get(`${baseUrl}/isuser`, {headers: {'Authorization': `Bearer ${token}`}})
        .then(retrieve_items())
        .catch(error => {
            if (error.response && error.response.status === 403) {
                notuser()
            } else {
                console.error(error);
            }
        }); 
    } else {
        notuser();
    }
    detect_dropdown()
    
    var cart = JSON.parse(localStorage.getItem('cart'));
    if (cart!=null){
        var subtotal=0;
        var promises = [];
        for(i=0;i<cart.length;i++){
            promises.push(
                axios.get(`${baseUrl}/game/${cart[i][0]}/${cart[i][1]}`)
                .then(response => {
                    let gameInfo = response.data[0]
                    if (gameInfo != null) {
                        var phtml = `<li class="list-group-item">
                        <div class="row">
                            <div class="col-8">
                                <img style="height:100px;" src="data:image/jpeg;base64,${gameInfo.image}">
                            </div>
                            <div class="col-4">
                                <p class="mt-1">Name: ${gameInfo.title}</p>
                                <p>Platform: ${gameInfo.platform}</p>
                                <p>Price: $${gameInfo.price}</p>
                            </div>
                        </div>
                      </li>`
                        subtotal += parseFloat(gameInfo.price)
                        $(".cart-card").append($(phtml));
                    }
                })
                .catch(error => console.error(error))
            );
        }
        Promise.all(promises).then(() => {
            var shipping = 15;
            var total = subtotal + shipping;
            if (subtotal > 100) {
                shipping = 0;
                total = subtotal;
            }
            var phtml = `
            <div class= "row"><div class="col-8">Subtotal:</div> <div class="col-4">$${subtotal.toFixed(2)}</div></div>
            <hr>
            <div class= "row"><div class="col-8">Shipping:</div><div class="col-4">$${shipping.toFixed(2)}</div></div>
            <hr>
            <div class= "row"><div class="col-8">Total:</div><div class="col-4">$${(total).toFixed(2)}</div></div>`
            $(".totals-s-cart").append($(phtml));
        });
    }
});

$('.payment-dropdown').on('change', function() {
    detect_dropdown()
});

$(".check-out-but").click(function(e){
    checkIfEmpty(e)
})
