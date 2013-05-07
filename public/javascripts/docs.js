! function($) {

	$(function() {
		var img = new Image();
		var id = "_beacon_" + Math.random();

		window[id] = img; // 防止img变量被浏览器过早回收
		img.src = "http://log.mmstat.com/ued.1.1.2?type=9&_gm:id=kissy_gallery&_r_=" + Math.random();
		img.onload = function() {
			window[id] = null;
		};

		$('pre').addClass('prettyprint');
		prettyPrint();

		$('.bs-docs-content').find('table').addClass('table table-striped table-bordered');

		var path = window.location.pathname;
		var reponame;
		if (path === '/guide' || path === '/quickstart') {
			reponame = 'gallery-express';
			$('.source').attr('href', 'https://github.com/kissygalleryteam/gallery-express');
		} else {
			var filepath = path.split('guide')[0],
				index = filepath.indexOf('/', 1),
				foldername = filepath.substring(index);
			reponame = filepath.substring(1, index);
			var githubUrl = 'https://github.com/kissygalleryteam/' + reponame + '/tree/master' + foldername;
			$('.source').attr('href', githubUrl);
			var starUrl = 'http://ghbtns.com/github-btn.html?user=kissygalleryteam&repo=' + reponame + '&type=watch&count=true&size=large';
			$('.github-star').attr('src', starUrl).show();
		}

		var githubRepo = 'kissygalleryteam/' + reponame;
		$('.github-widget').attr('data-repo', githubRepo);
		var githubRepoIssue = 'https://github.com/kissygalleryteam/' + reponame + '/issues/new';
		$('.GithubEmbed .btn').attr('href', githubRepoIssue);

		var h2_list = $('h2');
		var nav_list = $('.bs-docs-sidenav');
		for (var i = 0, len = h2_list.length; i < len; i++) {
			var cur_list = h2_list[i];
			list_title = cur_list.innerHTML;
			var list_id = cur_list.id ? cur_list.id : cur_list.id = list_title.replace(/[&.?!;:\*\(\)\s]/g, '_');
			nav_list.append('<li><a href = "#' + list_id + '">' + list_title + '</a></li>');
		}

		var nav_width = $('.bs-docs-sidebar .bs-docs-sidenav').width();
		var h1_width = $('.bs-docs-sidebar h1').width();
		var toggle_left = $('.bs-docs-sidebar .nav-toggle').css('margin-left');

		$('.bs-docs-sidebar .J_Toggle').click(function() {
			$('.bs-docs-sidebar .bs-docs-sidenav').animate({
				'width': '0',
				'opacity': '0'
			}, 600);

			$('.bs-docs-sidebar h1').animate({
				'width': '0',
				'opacity': '0'
			}, 600);

			$('.bs-docs-sidebar').animate({
				'width': '50px'
			}, 600);

			$('.bs-docs-content').animate({
				'width': '90%'
			}, 600);

			$('.bs-docs-sidebar .nav-toggle').animate({
				'margin-left': '0',
				'opacity': '0'
			}, 575, function() {
				$('.bs-docs-sidebar .nav-toggle').hide();
				$('.bs-docs-sidebar-mini').animate({
					'width': '26px'
				}, 200);
			});
		});

		$('.bs-docs-sidebar-mini .J_Toggle').click(function() {
			$('.bs-docs-sidebar-mini').animate({
				'width': '0'
			}, 200, function() {
				$('.bs-docs-sidebar .nav-toggle').show();
				$('.bs-docs-sidebar .bs-docs-sidenav').animate({
					'width': nav_width,
					'opacity': '1'
				}, 600);

				$('.bs-docs-sidebar h1').animate({
					'width': h1_width,
					'opacity': '1'
				}, 600);

				$('.bs-docs-sidebar .nav-toggle').animate({
					'margin-left': toggle_left,
					'opacity': '1'
				}, 600);

				$('.bs-docs-sidebar').animate({
					'width': '23.404255319148934%'
				}, 600);

				$('.bs-docs-content').animate({
					'width': '74.46808510638297%'
				}, 600);
			});
		});

	});

}(window.jQuery);