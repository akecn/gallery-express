(function(S){
    S.use('xtemplate,node',function(S,XTemplate,Node){
        var $ = Node.all;
        S.io.jsonp('https://api.github.com/orgs/kissygalleryteam/repos',{per_page:10,sort:'pushed'},function(res){
            var tpl = '<ul class="row">' +
                            '{{#each data}}'+
                                '<li class="span4">' +
                                    '<h4><a href="{{svn_url}}">{{name}}</a></h4>' +
                                    '<p>{{description}}</p>'+
                                '</li>' +
                            '{{/each}}'
                      '</ul>';
            var html = new XTemplate(tpl).render(res);
            $('#J_Coms').html(html);
        })
    })
})(KISSY)