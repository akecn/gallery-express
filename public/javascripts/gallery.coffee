KISSY.add 'gallery-js',(S,ComboBox)->

    #顶部搜索框
    tmpl = "<a href='http://gallery.kissyui.com/{name}/{version}/guide/index.html'><div class='item-wrapper'>" + "{name}" + "<span> by {userName}</span>" + "</div></a>"

    data = new ComboBox.RemoteDataSource
                  xhrCfg: {
                    url: './api/search',
                    dataType: 'jsonp'
                  },
                  paramName: "name",
                  parse: (query, results)->
                            return results.result
                  ,
                  cache: true

    comboBox = new ComboBox {
                  prefixCls: 'search-',
                  placeholder: '点我搜索',
                  srcNode: S.one("#combobox"),
                  dataSource: data,
                  format: (query, results)->
                    ret = []
                    S.each results, (r)->
                      r.userName = r.author.name
                      item = {
                              textContent: r.name,
                              content: S.substitute(tmpl, r)
                      }
                      ret.push(item)

                    return ret;
                }
    comboBox.render()
  ,{requires:['combobox']}