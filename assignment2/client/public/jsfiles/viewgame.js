//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
var gameid;
var cart = JSON.parse(localStorage.getItem('cart'));
if (cart == null) {cart = [];}

var platfrom;
$(document).ready(function(){
    const currentUrl = window.location.href;
    const pathSegments = currentUrl.split('/');
    gameid = pathSegments[4];
    platform = pathSegments[5];

    axios.get(`${baseUrl}/game/${gameid}/${platform}`)
    .then(response =>{
        let gameInfo = response.data[0]
        var str="Remove from Cart";
        if (gameInfo != null){
            const newCart = cart.filter(item => !(item[0] === gameid && item[1] === platform));
            if(newCart.length == cart.length){str = "Add to cart"}
            const phtml = `<div class="row justify-content-start">
            <div class="col-4" style="overflow: hidden;">
              <img style="object-fit: cover;width: 100%; padding: none; margin-bottom: 3rem;"  src="data:image/jpeg;base64,${gameInfo.image}" alt="Logo">
            </div>
            <div class="col-4 d-flex text-start flex-column">
              <h3>${gameInfo.title}</h3>
              <p>Platform: ${gameInfo.platform}</p>
              <p>Category: ${gameInfo.catname}</p>
              <p>Published year: ${gameInfo.year}</p>
              <p>Description: ${gameInfo.description}</p>
              <p>Price: ${gameInfo.price}</p>
              <button class="btn btn-primary add-c-but" style = "width:11rem;" type="button">${str}</button>
            </div>
          </div>`
            $(".gameInfo").append($(phtml));

            $(".add-c-but").click(function(){
                if ($(this).text()=="Add to cart"){
                    cart.push([gameid, platform]);
                    console.log(cart)
                    $(this).text("Remove from Cart");
                    localStorage.setItem('cart',JSON.stringify(cart));
                }else{
                    const newCart = cart.filter(item => !(item[0] === gameid && item[1] === platform));
                    cart = newCart;
                    $(this).text("Add to cart");
                    localStorage.setItem('cart',JSON.stringify(cart));
                }
            })

            axios.get(`${baseUrl}/isadmin`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
            .then(response => {
                if (response.data.isAdmin) {
                    $(".add-c-but").prop("disabled", true);
                    $(".game-r-post-but").prop("disabled", true);
                }
            })
            .catch(error => console.error(error));
            }
    })
    .catch(error => console.error(error));

    axios.get(`${baseUrl}/gamereview/${gameid}`)
    .then(response => {
        if (response.data.results.length > 0) {
            var phtml = `<p>Average rating: ${response.data.avgrating}</p>`
            $(".viewgame-review").append($(phtml));
            for (let i = 0; i < response.data.results.length; i++) {
                var rhtml = "";
                var stars = 0;
                for (let j = 0; j < 5; j++) {
                    if (stars < parseInt(response.data.results[i].rating)) {
                        rhtml += `<img src="/images/heart.gif" style ="width: 60px !important;" alt="1">`
                        stars++;
                    } else {
                        rhtml += `<img src="/images/memorial.gif" alt="0" style ="width: 60px !important;">`
                    }
                }
                phtml = `<div class="card m-3">
                <div data-rating=${parseInt(response.data.results[i].rating)} data-rev-id=${response.data.results[i].reviewid} class="card-body current-review">
                <h5 class="card-title">${response.data.results[i].username}</h5>
                    <div class = "row container-fluid">${rhtml}</div>
                    <p class="card-text current-content">${response.data.results[i].content}</p>
                    <p class="card-text"><small class="text-body-secondary">${response.data.results[i].created_at}</small></p>
                    </div>
                </div>`;
                $(".viewgame-review").append($(phtml));

                const user_id = localStorage.getItem('userID');
                const token = localStorage.getItem('token');

                if (token != null && user_id != null && user_id == response.data.results[i].userid) {
                    axios.get(`${baseUrl}/isuser`, { headers: { 'Authorization': `Bearer ${token}` } })
                        .then(isUserResponse => {
                            ehtml = `<div class="row">
                            <a class="col-auto edit-rev">
                            <img src="https://cdn-icons-png.flaticon.com/512/1994/1994244.png" alt="edit" width="30" class="d-inline-block align-text-top p-0">
                            </a>
                            <a class="col-auto del-rev">
                            <img src="https://cdn-icons-png.flaticon.com/512/3096/3096673.png" alt="delete" width="30" class="d-inline-block align-text-top p-0">
                            </a>
                            <div>`;

                            $(`[data-rev-id=${response.data.results[i].reviewid}]`).append($(ehtml));
                        })
                        .catch(error => console.log(error))
                }
            }
        }else{
            var phtml = `<h5>Be the first to write a review!</h5>`
            $(".viewgame-review").append($(phtml));
        }
    })
    .catch(error => console.error(error));
})

$(".game-rating-li").on("click", "a", function (event) {
    $(".game-rating-but").text($(this).text());
});

$(".viewgame-review").on("click", ".edit-li", function (event) {
    $(this).closest('.edit-review').find('.game-rating-but-rev').text($(this).text());
});

$(".game-r-post-but").click(function(){
    var urating = parseInt($('.game-rating-but').text());
    var ucomment = $('.game-r-comment').val();
    axios.get(`${baseUrl}/isuser`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
    .then(response =>{
        if(response.data.isUser){
            axios.post(`${baseUrl}/user/${localStorage.getItem('userID')}/game/${gameid}/review/`, {content:ucomment, rating:urating}, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
            .then(() => location.reload())
            .catch(error => console.error(error));
        }
    })
    .catch(error => {
        if (error.response && error.response.status === 403) {
            alert("Please login first.")
        } else {
            console.error(error);
        }
    })
})


$(".viewgame-review").on("click", ".edit-rev", function (event) {
    var currentReview = $(this).closest('.current-review');
    var editReview = currentReview.find('.edit-review');
    if (editReview.length === 0) {
        var phtml = `<div class = "mt-3 edit-review">
        <h4>Edit your review:</h4>
        <div class="mb-3">
          <div class="row mb-3">
            <label class="form-label col-1">Your rating:</label>
            <div class="dropdown col-auto">
              <button class="btn btn-light dropdown-toggle game-rating-but-rev" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                ${currentReview.data('rating')}
              </button>
              <ul class="dropdown-menu">
                <li class="edit-li"><a class="dropdown-item" >1</a></li>
                <li class="edit-li"><a class="dropdown-item" >2</a></li>
                <li class="edit-li"><a class="dropdown-item" >3</a></li>
                <li class="edit-li"><a class="dropdown-item" >4</a></li>
                <li class="edit-li"><a class="dropdown-item" >5</a></li>
              </ul>
            </div>
          </div>
          
            <label class="form-label">Your comment:</label>
            <textarea class="form-control game-r-comment-rev" rows="3">${currentReview.find('.current-content').text()}</textarea>
            <button type="submit" class="btn btn-primary mt-3 game-r-post-but-rev">Edit</button>
          </div>
    </div>`;
        currentReview.append($(phtml));
    } else {
        editReview.remove();
    }
});

$(".viewgame-review").on("click", ".del-rev", function (event) {
    const eratingid = parseInt($(this).closest('.current-review').data('rev-id'));
    axios.delete(`${baseUrl}/gamereview/${eratingid}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
    .catch(error => {
        alert("Could not delete your review.")
        console.error(error)});
    location.reload(true)
});

$(".viewgame-review").on("click", ".game-r-post-but-rev", function (event) {
    event.preventDefault();
    const erating = parseInt($(this).closest('.edit-review').find('.game-rating-but-rev').text());
    const eratingid = parseInt($(this).closest('.current-review').data('rev-id'));
    const econtent = $(this).closest('.edit-review').find('.game-r-comment-rev').val();
    if (econtent==""){
        alert("Please enter something in the edit comment section.")
    }else{
        axios.put(`${baseUrl}/gamereview/`, {content:econtent, rating:erating, reviewid:eratingid}, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
        .catch(error => {
            alert("Could not edit your review.")
            console.error(error)});
        location.reload(true)
    }
});
