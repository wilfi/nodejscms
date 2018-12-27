/**
* server.js
*/

// loading the things we need
var express = require('express'),
    parser = require('body-parser'),
    path = require('path'),
    app = express();
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

var url = require('url') ;

app.use(parser.urlencoded({extended:false}));
app.use(parser.json());


// setting the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


// including the routes
require('./config/routes.js')(app);   

app.setMaxListeners(0);
io.setMaxListeners(0);
server.listen(4000);
console.log('CMS app is running on port 4000');

/*****  ALERTS PUSH NOTIFICATION LOGIC STARTS HERE *****/

var	db 					= require('./config/database.js'),
	connectionsArray    = [],
	POLLING_INTERVAL = 3000,
	pollingTimer;

/*
* 
* This function loops on itself since there are sockets connected to the page
* sending the result of the database query after a constant interval
*
*/
var pollingLoop = function () {

	    // Doing the database query for getting the latest alerts
	    var activityQuery = "SELECT id,title,status FROM  articles WHERE DATE_ADD(updatedDate, INTERVAL 15 MINUTE) >= NOW() order by updatedDate desc",
	        alerts = []; // this array will contain the result of our db query
	
		db.getConnection(function(err, connection) {
	        if (err) {
	            connection.release();
	            callback({ "code": 100, "status":"failed","message": "Error in connection database" });
	        }
	        else{

		        // setting the query listeners
			    connection.query(activityQuery)
			    .on('error', function(err) {
			        // Handle error, and 'end' event will be emitted after this as well
			        console.log( err );
			        updateSockets( err );
			    })
			    .on('result', function(alert_messages) {
			        // it fills our array looping on each alert row inside the db
			    	alerts.push( alert_messages );
			    })
			    .on('end',function(){
			        // loop on itself only if there are sockets still connected
			        if(connectionsArray.length) {
			            pollingTimer = setTimeout( pollingLoop, POLLING_INTERVAL );
			            updateSockets(alerts);
			        }
			    });
			    connection.release();
	        }

	    });

	    

};

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on( 'connection', function ( socket ) {
	    //console.log('Number of connections:' + connectionsArray.length);
	    // starting the loop only if at least there is one user connected
	    if (!connectionsArray.length) {
	        pollingLoop();
	    }
	    
	    socket.on('disconnect', function () {
	        var socketIndex = connectionsArray.indexOf( socket );
	        //console.log('socket = ' + socketIndex + ' disconnected');
	        if (socketIndex >= 0) {
	            connectionsArray.splice( socketIndex, 1 );
	        }
	    });
	
	    //console.log( 'A new socket is connected!' );
	    connectionsArray.push( socket );
    
});

/*
* updateSockets()
* This function updates all the users
* with the latest updated alerts.
*/
var updateSockets = function ( data ) {
    // adding the time of the last update
    data.time = new Date();
    // sending new data to all the sockets connected
    connectionsArray.forEach(function( tmpSocket ){
        tmpSocket.volatile.emit( 'notification' , data );
    });
};

/*****  ALERTS PUSH NOTIFICATION LOGIC ENDS HERE *****/
