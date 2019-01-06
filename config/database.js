var mysql = require('mysql');

//mysql connection pool creation.
var pool    =   mysql.createPool({
				    connectionLimit : 100,
				    host     : 'localhost',
				    user     : 'root',
				    password : 'Wil_2091',
				    database : 'node_cms',
				    debug    :  true
				});

//creating a connection
exports.getConnection = function(callback){
	pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
}
