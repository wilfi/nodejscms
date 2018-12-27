/**
* main.js
*/

//This function is used to delete the article
function deleteArticle(articleId)
{
	if(confirm('Are you sure, you want to delete this article?')){
		
		$('#article_'+articleId+' .actionIcon').hide();
		$('#article_'+articleId+' .loadingMsg').show();
		$.ajax({
			type:"get",
			url:"/article/"+articleId+"/delete",
			data:'',
			success:function(response)
			{
				$('#article_'+articleId+' .actionIcon').show();
				$('#article_'+articleId+' .loadingMsg').hide();
				if(response.status == 'success'){
					$('#article_'+articleId).remove();
					if($('.articleItem').length == 0){
						$('#articlesList').html('<li class="list-group-item">No articles are created yet.  You can create one by clicking on Add Article.</li>');
					}
				}
				else{
					alert(response.message);
					window.location.reload();
				}
			},
			error:function(e)
			{
	 			console.log(e);
				$('#article_'+articleId+' .actionIcon').show();
				$('#article_'+articleId+' .loadingMsg').hide();
			}
	   });
	}
}