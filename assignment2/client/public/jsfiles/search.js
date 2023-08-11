//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
$(document).ready(function () {
    axios.get(`${baseUrl}/platforms`)
    .then((response)=>{
        for(i=0;i<response.data.length; i++){
            const phtml = `<li><a class="dropdown-item" href="#">${response.data[i].platformname}</a></li>`
            $(".index-pltform-li").append($(phtml));
        }

        const phtml = `<li><a class="dropdown-item" href="#">Any</a></li>`
        $(".index-pltform-li").append($(phtml));
    })
    .catch((error)=>{console.log(error)})
    var uplatform ="Any";
 
    $(".index-pltform-li").on("click", "a", function (event) {
        uplatform = $(this).text();
        $(".index-platform-but").text(uplatform);
    });

    function index_search(){
        const gamestr = $(".index-search-bar").val().trim();
        const requestbody = {platform:uplatform, gamestr:gamestr}
        axios.post(`${baseUrl}/allgames`, requestbody)
        .then((response)=>{
            $(".display-game").empty();
            for (i=0;i<response.data.length; i++){
                const phtml = `
                <div class="card m-3" style="width: 18rem; height: 35rem;">
                <img style="height:18rem; object-fit: cover; overflow: hidden;" src="data:image/jpeg;base64,${response.data[i].image}"  class="card-img-top m-1" alt="No image">
                <div class="card-body">
                  <h5 class="card-title">${response.data[i].title}</h5>
                  <p class="card-text">${response.data[i].platform}</p>
                  <p class="card-text">$${parseFloat(response.data[i].price).toFixed(2)}</p>
                  <a href="http://localhost:8082/game/${response.data[i].gameid}/${response.data[i].platform}" data-game-info="${encodeURIComponent(JSON.stringify(response.data[i]))}" class="btn btn-primary viewDetails">View Details</a>
                </div>
              </div>` 
              $(".display-game").append($(phtml));
            }

            if (response.data.length==0){
                const phtml = `<h2 class="text-center">Oops. No Results :(<h2>` 
              $(".display-game").append($(phtml));
            }
        })
        .catch((error)=>{console.log(error)})
    }

    $(".index-search").click(index_search())
    $(".index-search-bar").keypress(function(event) {
        if (event.which == 13) {
            index_search();
        }
    });

});
