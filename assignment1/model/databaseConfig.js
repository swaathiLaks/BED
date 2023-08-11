//Swaathi Lakshmanan
//P2227171
//DISM/FT/2B/21
var mysql = require("mysql");

var dbConnect = {
  getConnection: function () {
    var conn = mysql.createConnection({
      host: "localhost",
      user: "root777",
      password: "root777",
      database: "sp_games_assignment_1",
    });

    return conn;
  },
};
module.exports = dbConnect;