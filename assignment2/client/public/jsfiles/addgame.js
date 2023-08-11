//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
$(document).ready(function(){
    const token = localStorage.getItem('token');
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


$('.game-plats').on('click', '.add-plat', function() {
    var phtml = `<div class="mb-2 platform-container row">
    <div class="btn-group col-auto">
        <button name="platform" data-plat-id="none" class="btn btn-secondary dropdown-toggle plat-but" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
          Platform
        </button>
        <ul class="dropdown-menu plat-li">
          <li><a class="dropdown-item" href="#">Menu item</a></li>
        </ul>
      </div>
      <button type="submit" class="add-plat btn p-0 col-auto"><img style="width: 30px;" src="https://cdn-icons-png.flaticon.com/512/992/992651.png"></button>
      <button type="submit" class="del-plat btn p-0 ms-2 col-auto"><img style="width: 30px;" src="https://cdn-icons-png.flaticon.com/512/992/992660.png"></button>
  </div>`
  $('.game-plats').append(phtml)
});

$('.game-plats').on('click', '.del-plat', function() {
    $(this).closest('.platform-container').remove();
});

$('.game-cats').on('click', '.add-cat', function() {
    phtml = `<div class="mb-2 category-container">
    <div class="btn-group mb-2">
        <button name="category" data-cat-id="none" class="btn btn-secondary dropdown-toggle cat-but" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
          Category
        </button>
        <ul class="dropdown-menu cat-li">
          <li><a class="dropdown-item" href="#">Menu item</a></li>
        </ul>
      </div>
      <button type="submit" class="add-cat btn p-0"><img style="width: 30px;" src="https://cdn-icons-png.flaticon.com/512/992/992651.png"></button>
      <button type="submit" class="del-cat btn p-0"><img style="width: 30px;" src="https://cdn-icons-png.flaticon.com/512/992/992660.png"></button>
  </div>`
  $('.game-cats').append(phtml)
});

$('.game-cats').on('click', '.del-cat', function() {
    $(this).closest('.category-container').remove();
});

$('.game-plats').on('click', '.plat-li a', function() {
    $(this).closest('.plat-li').siblings('.plat-but').text($(this).text());
    $(this).closest('.plat-li').siblings('.plat-but').data('plat-id', $(this).data('plat-id'));
});

$('.game-cats').on('click', '.cat-li a', function() {
    $(this).closest('.cat-li').siblings('.cat-but').text($(this).text());
    $(this).closest('.cat-li').siblings('.cat-but').data('cat-id', $(this).data('cat-id'));
});

$('.game-cats').on('click', '.cat-but', function() {
    axios.get(`${baseUrl}/categories`)
    .then((response)=>{
        var chosencats = $('.cat-but').map(function() {return $(this).text();}).get();
        $(this).siblings('.cat-li').empty();
        for(i=0;i<response.data.length; i++){
            var checkbool=true
            for (j=0;j<chosencats.length;j++){
                if (chosencats[j]==response.data[i].catname){checkbool = false}
            }
            if (checkbool){
                const phtml = `<li><a class="dropdown-item" data-cat-id="${response.data[i].categoryid}" href="#">${response.data[i].catname}</a></li>`
                $(this).siblings('.cat-li').append($(phtml));
            }
        }
    })
    .catch((error)=>{console.log(error)})
});

$('.game-plats').on('click', '.plat-but', function() {
    axios.get(`${baseUrl}/platforms`)
    .then((response)=>{
        var chosenplats = $('.plat-but').map(function() {return $(this).text();}).get();
        $(this).siblings('.plat-li').empty();
        for(i=0;i<response.data.length; i++){
            var checkbool=true
            for (j=0;j<chosenplats.length;j++){
                if (chosenplats[j]==response.data[i].platformname){checkbool = false}
            }
            if (checkbool){
                const phtml = `<li><a class="dropdown-item" data-plat-id="${response.data[i].platformid}" href="#">${response.data[i].platformname}</a></li>`
                $(this).siblings('.plat-li').append($(phtml));
            }
        }

    })
    .catch((error)=>{console.log(error)})
    if ($(this).closest('.platform-container').find('input[type="text"]').length === 0) {
        $(this).closest('.platform-container').append('<input type="text"  style="width:100px;" class="form-control col-auto ms-2" name="price" placeholder="Price">');
    }
});

function checkIfEmpty(e){
    e.preventDefault();
    var formData = $('.add-game-form').find(':input').map(function() {
        return {
            name: this.name,
            value: $(this).val(),
            data: $(this).data()
        };
    }).get();
    console.log(formData)
    var year;
    for (let i = 0; i < formData.length; i++) {
        
        if (formData[i].value == "" && (formData[i].name == "title"||formData[i].name == "description"||formData[i].name == "year"||formData[i].name == "price")) {
            alert("Please fill up all fields!");
            return false;
        }

        var filePath = $('[name="aimage"]').val();
        var fileExtension = filePath.split('.').pop().toLowerCase();
        if (fileExtension != 'jpg') {
            alert("Images can only be jpg.")
            return false;
        }

        if (formData[i].name == "year") {
            year = parseInt(formData[i].value);
            if (1950 > year || year > 3000 || isNaN(year)){
                console.log(year)
                alert("Please enter valid year!");
                return false;
            } 
        }

        if(formData[i].name=="price"){
            var price = parseFloat(formData[i].value);
            if (isNaN(price) || price < 0) {
                alert('Please enter a valid price!');
                return;
            }
        }

        if (formData[i].data.catID=="none"||formData[i].data.platID=="none"){
            alert("Please fill up all fields!");
            return false;
        }
       
    }

    var prices = ($('[name="price"]').map(function() {return $(this).val();}).get()).join(',');
    var categories = ($('.cat-but').map(function() {return $(this).data('cat-id');}).get()).join(',');
    var platforms = ($('.plat-but').map(function() {return $(this).data('plat-id');}).get()).join(',');
    const token = localStorage.getItem('token');
    var requestbody = new FormData();

    var tempbody= {title:formData[0].value, description:formData[1].value, year:year, categoryid:categories,platformid:platforms,price:prices}
    for (const [key, value] of Object.entries(tempbody)) {
        requestbody.append(key, value);
    }    
    requestbody.append('image', $('input[name="aimage"]')[0].files[0])
    axios.post(`${baseUrl}/game`,requestbody,{headers: {'Authorization': `Bearer ${token}`}})
    .then(()=>{alert("Game was created."); location.reload();})
    .catch((error)=>{
        if (error.response && error.response.status === 422){
            alert('Game exists')
        }
        console.log(error)
    })
}

$('.create-but').click(function(e){
    checkIfEmpty(e)
})