//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
const db = require("./databaseConfig");

function insert(arglist, insertQuery, justid, callback)  {
    var dbConn = db.getConnection();
    dbConn.connect(function (err) {
        if (err) {
        console.log(err);
        return callback(err, null);
        } else {
        dbConn.query(
            insertQuery,
            arglist,
            (error, results) => {
            dbConn.end();
            if (error) {
                return callback(error, null);            
            };
            if (justid){
                return callback(null, results.insertId);
            }else{
                return callback(null, results);
            }
            });
        }
    });
} 

module.exports = insert;