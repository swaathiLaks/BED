//Swaathi Lakshmanan
//P2227171
//DISM/FT/2B/21
var app = require("./controller/app");

var port = 8081;

var server = app.listen(port, function () {
  console.log("Web App hosted http://localhost:%s", port);
});