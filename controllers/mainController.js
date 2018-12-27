var mainModel = require("../models/mainModel.js");

/*************************************************************
*home()
*This function loads the admin login page.
************************************************************/
exports.home = function(req,res)
{
    mainModel.getAllArticles(function(response){
    	response.title = 'Home';
    	response.articles = response;
    	res.render("pages/home",response);
	});
};

/*************************************************************
*showAddArticleForm()
*This function loads the admin login page.
************************************************************/
exports.showAddArticleForm = function(req,res)
{
    res.render("pages/article",{action:'add'});
};

/*************************************************************
*showArticle()
*This function loads the admin login page.
************************************************************/
exports.showArticle = function(req,res)
{
    var articleId = req.params.articleId;
    mainModel.getArticle(articleId,function(response){
    	response.action = 'show'; 
    	response.article = response;
    	res.render("pages/article",response);
	});
};

/*************************************************************
*editArticle()
*This function loads the admin login page.
************************************************************/
exports.editArticle = function(req,res)
{
    var articleId = req.params.articleId;
    mainModel.getArticle(articleId,function(response){
    	response.action = 'edit';
    	response.article = response;
    	res.render("pages/article",response);
	});
};

/*************************************************************
*saveArticle()
*This function loads the admin login page.
************************************************************/
exports.saveArticle = function(req,res)
{

	var inputData = {};
	inputData.title = req.body.title == undefined ? '' : req.body.title;
	inputData.description = req.body.description == undefined ? '' : req.body.description;
	if(req.params.articleId !== undefined){
		inputData.articleId = req.params.articleId;
	}

	mainModel.saveArticle(inputData,function(response){
    	res.redirect('/');
	});

};

/*************************************************************
*deleteArticle()
*This function loads the admin login page.
************************************************************/
exports.deleteArticle = function(req,res)
{
	var articleId = req.params.articleId == undefined ? '' : req.params.articleId;
    mainModel.deleteArticle(articleId,function(response){
    	res.send(response);
	});
};