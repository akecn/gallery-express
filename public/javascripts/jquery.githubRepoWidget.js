/**
 * Original: https://github.com/JoelSutherland/GitHub-jQuery-Repo-Widget
 * Modify by tsl0922@gmail.com 
 */
$(function(){
	
	var i = 0;

	$('.github-widget').each(function(){

		if(i == 0) $('head').append('<style type="text/css">.github-box{font-family:helvetica,arial,sans-serif;font-size:13px;line-height:18px;background:#fafafa;border:1px solid #ddd;color:#666;border-radius:3px}.github-box a{color:#4183c4;border:0;text-decoration:none}.github-box .github-box-title{position:relative;border-bottom:1px solid #ddd;border-radius:3px 3px 0 0;background:#fcfcfc;background:-moz-linear-gradient(#fcfcfc,#ebebeb);background:-webkit-linear-gradient(#fcfcfc,#ebebeb);}.github-box .github-box-title h3{font-family:helvetica,arial,sans-serif;font-weight:normal;font-size:16px;color:gray;margin:0;padding:10px 10px 10px 80px;background:url(http://www.oschina.net/img/github_logo.gif) center left no-repeat}.github-box .github-box-title h3 .repo{font-weight:bold}.github-box .github-box-title .github-stats{position:absolute;top:8px;right:10px;background:white;border:1px solid #ddd;border-radius:3px;font-size:11px;font-weight:bold;line-height:21px;height:21px;padding-left:2px;}.github-box .github-box-title .github-stats a{display:inline-block;height:21px;color:#666;padding:0 5px 0 5px;}.github-box .github-box-title .github-stats .watchers{border-right:1px solid #ddd;background-position:3px -2px;}.github-box .github-box-title .github-stats .forks{background-position:0 -52px;padding-left:5px}.github-box .github-box-content{padding:10px;font-weight:300}.github-box .github-box-content p{margin:0}.github-box .github-box-content .link{font-weight:bold}.github-box .github-box-download{position:relative;border-top:1px solid #ddd;background:white;border-radius:0 0 3px 3px;padding:10px;height:24px}.github-box .github-box-download .updated{margin:0;font-size:11px;color:#666;line-height:24px;font-weight:300}.github-box .github-box-download .updated strong{font-weight:bold;color:#000}.github-box .github-box-download .download{position:absolute;display:block;top:10px;right:10px;height:24px;line-height:24px;font-size:12px;color:#666;font-weight:bold;text-shadow:0 1px 0 rgba(255,255,255,0.9);padding:0 10px;border:1px solid #ddd;border-bottom-color:#bbb;border-radius:3px;background:#f5f5f5;background:-moz-linear-gradient(#f5f5f5,#e5e5e5);background:-webkit-linear-gradient(#f5f5f5,#e5e5e5);}.github-box .github-box-download .download:hover{color:#527894;border-color:#cfe3ed;border-bottom-color:#9fc7db;background:#f1f7fa;background:-moz-linear-gradient(#f1f7fa,#dbeaf1);background:-webkit-linear-gradient(#f1f7fa,#dbeaf1);</style>');
		i++;

		var $container = $(this);
		var repo_name = $container.data('repo');

		$.ajax({
			url: 'https://api.github.com/repos/' + repo_name,
			dataType: 'jsonp',

			success: function(results){
				var repo = results.data;
                var parent = repo.parent?repo.parent:repo;
				var pushed_at = repo.pushed_at.substr(0,10);
				if(repo.homepage == null || repo.homepage == 'null') repo.homepage = '';
				
				var $widget = $(' \
					<div class="github-box repo">  \
					    <div class="github-box-title"> \
					        <h3> \
					            <a class="owner" href="' + parent.owner.url.replace('api.','').replace('users/','') + '" target="_blank">' + parent.owner.login  + '</a> \
					            /  \
					            <a class="repo" href="' + parent.url.replace('api.','').replace('repos/','') + '" target="_blank">' + parent.name + '</a> \
					        </h3> \
					        <div class="github-stats"> \
					        Watch<a class="watchers" title="Watchers" href="' + parent.url.replace('api.','').replace('repos/','') + '/watchers" target="_blank">' + parent.watchers + '</a> \
					        Fork<a class="forks" title="Forks" href="' + parent.url.replace('api.','').replace('repos/','') + '/network" target="_blank">' + parent.forks + '</a> \
					        </div> \
					    </div> \
					    <div class="github-box-content"> \
					        <p class="description">' + parent.description + ' &mdash; <a href="' + parent.url.replace('api.','').replace('repos/','') + '#readme"  target="_blank">More...</a></p> \
					        <table class="issues" width="100%"></table> \
					    </div> \
					    <div class="github-box-download"> \
					        <p class="updated"><a href="' + parent.url.replace('api.','').replace('repos/','') + '/tree/master" target="_blank"><strong>master</strong>分支</a>代码最近更新：' + pushed_at + '</p> \
					        <a class="btn btn-priamry" target="_blank" href="' + parent.url.replace('api.','').replace('repos/','') + '/issues/new">提交issues</a> \
                            <a class="download" href="' + parent.url.replace('api.','').replace('repos/','') + '/zipball/master">下载zip</a> \
					    </div> \
					</div> \
				');
				$widget.appendTo($container);
				if(parent.has_issues && parent.open_issues > 0) {
					$.ajax({
						url: 'https://api.github.com/repos/' + parent.owner.login +'/' + parent.name + "/issues",
						dataType: 'jsonp',
                        data:{
                            state:'open',
                            per_page:5,
                            page:1,
                            sort:'update'
                        },
						success: function(results){
							var issues = results.data;
							var $issues_table = $(".github-box-content table");
							for(var i=0;i<issues.length;i++) {
								var updated_at = issues[i].updated_at.substr(0,10);
								$issues_table.append('<tr> \
										<td class="number" width="30">#' + issues[i].number + '</td> \
										<td class="info"><a href="' + issues[i].html_url + '" target="_blank">' + issues[i].title + '</a></td> \
										<td class="author" width="200" align="right">by <a href="' + issues[i].user.url.replace('api.','').replace('users/','') 
										+'" target="_blank">' + issues[i].user.login
										+ '</a>&nbsp;&nbsp;<em style="font-size: 8pt;font-family: Candara,arial;cursor:default;color: #fff;-webkit-text-size-adjust: none;">' 
										+ updated_at +'</em></td></tr> \
								');
							}
						}
					});
	    		}
			} 
		})
	});

});
