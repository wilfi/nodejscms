/**
* routes.js
*/

//including the controllers
var mainCtrl = require("../controllers/mainController");

// initializing all the app routes
module.exports = function(app){

	app.get("/",mainCtrl.home);
	app.get("/article/add",mainCtrl.showAddArticleForm);
	app.get("/article/:articleId",mainCtrl.showArticle);
	app.get("/article/:articleId/edit",mainCtrl.editArticle);
	app.post("/article/save",mainCtrl.saveArticle);
	app.post("/article/:articleId/save",mainCtrl.saveArticle);
	app.get("/article/:articleId/delete",mainCtrl.deleteArticle);

};