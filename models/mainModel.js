var db = require('../config/database.js');
var moment = require('moment');

/**
* This function is used to get all the articles list
*/
exports.getAllArticles = function(callback)
{
	
	var articlesQuery = "select  id,title from articles where status != 'deleted' order by updatedDate desc";

	db.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            callback({ "code": 100, "status":"failed","message": "Error in connection database" });
        }
        else{

	        connection.query(articlesQuery,function(err, rows) {
	            connection.release();
	            if (err) {
	            	callback({ "code": 100, "status": "failed","message": "Error while saving data" });
				}
	            else {
	            	//console.log(rows)
	            	callback(rows);
	            }
	        });
        }
    });
};

/**
* This function is used to get the corresponding article details
*/
exports.getArticle = function(articleId,callback)
{
	
	var articlesQuery = "select  * from articles where id = '"+articleId+"'";

	db.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            callback({ "code": 100, "status":"failed","message": "Error in connection database" });
        }
        else{

	        connection.query(articlesQuery,function(err, rows) {
	            connection.release();
	            if (err) {
	            	callback({ "code": 100, "status": "failed","message": "Error while saving data" });
				}
	            else {
	            	callback(rows[0]);
	            }
	        });
        }

    });
};

/**
* This function is used to add/update the article
*/
exports.saveArticle = function(data,callback)
{
	var articleData = {title: data["title"], description: data["description"]};
	console.log(articleData);
    //insert article data
    if(data['articleId'] === undefined){
    	articleData.status = 'created';
    	articleData.updatedDate = moment().format('YYYY-MM-DD HH:mm:ss');
		var saveQuery= "insert into  articles SET ?";
    }
    else{
    	articleData.status = 'edited';
    	articleData.updatedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    	var saveQuery= "update articles set ? where id = "+data['articleId'];
    }

	db.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            callback({ "code": 100, "status":"failed","message": "Error in connection database" });
        }
        else{

	        connection.query(saveQuery, articleData, function(err, result) {
	            connection.release();
	            if (err) {
	            	callback({ "code": 100, "status": "failed","message": "Error while saving article.Please try again." });
				}
	            else {
	            	callback(result);
	            }
	        });
        }
    });
};

/**
* This function is used to delete an article permanently
*/
exports.deleteArticle = function(articleId,callback)
{
	var articleData = {status: 'deleted', updatedDate: moment().format('YYYY-MM-DD HH:mm:ss')};

	var deleteQuery = "update articles set ? where id = "+articleId;
	db.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            callback({ "code": 100, "status":"failed","message": "Error in connection database" });
        }
        else{

	        connection.query(deleteQuery, articleData, function(err, result) {
	            connection.release();
	            if (err) {
	            	callback({ "code": 100, "status": "failed","message": "Error while deleting article.Please try again." });
				}
	            else {
	            	if(result.affectedRows == '1'){
	            		callback({"code":200, "status":"success","message":"Article deleted successfully"});
	            	}
	            	else{
	            		callback({"code":100, "status":"failed","message":"Article delete failed.Please try again."});
	            	}
	            }
	        });
        }

    });
};