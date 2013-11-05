/**
 * gallery 主页自适应排序布局，欢迎大家使用和反馈
 * 主页地址：http://gallery.kissyui.com/autoResponsive/1.3/guide/index.html
 * dafeng.xdf@taobao.com
 */
;KISSY.ready(function(S){
    S.add('gallery-page/layout',function(S,Node,Auto,Sort){
        var $ = Node.all;
        var D = S.DOM,E = S.Event;
        var container = S.get('#J_List');
        var controls = S.get('.controls');
        var createBtn = S.get('.J_SortNew');
        var search = S.get('#J_Search');
        var listItem = D.query('li',container);
        var item = '.item';
        var component = S.get('.component');

        function Layout(){
            this.init();
        }
        
        S.augment(Layout,{
            init:function(){
                this.render();
                this.bindEvent();
            }
            ,render:function(){
                var that = this;
                that.range = new Sort();
                that.autoResponsive = new Auto({
                    container:container,
                    selector:item,
                    unitMargin:{
                        x :10,
                        y:10
                    },
                    plugins:[that.range],
                    autoInit:false,
                    suspend:true,
                    resizeFrequency:150,
                    whensRecountUnitWH:['resize','adjust']
                });
                that.autoResponsive.init();
                setTimeout(function(){
                    that.autoHeight();
                    that.execSort();
                },10);

                var $showAll = $('.J_ShowAll');

                var isShowAll = false;

                var $tagList = $('.J_AuthorTagsWrapper');

                var height = $tagList.height();

                $showAll.on('click', function(ev) {
                    if (isShowAll) {
                        isShowAll = false;
                        $tagList.animate({height:height},0.3);
                    } else {
                        var ulHeight = $tagList.children('ul').height();
                        $tagList.animate({height:ulHeight},0.3);
                        isShowAll = true;
                    }
                });
            }
            ,autoHeight:function(){
                try {
                    document.domain = "kissyui.com";
                    parent = window.parent;
                    var body = S.get('body');
                    var height = D.height(body) + 50;
                    iframe = parent.document.getElementsByTagName('iframe')[0];
                    iframe.height = height;
                  } catch (_error) {}
            }
            ,execSort:function(target){
                var that = this;
                var _target = target ? target : createBtn;
                that.clearTags();
                that.changeBtnView(_target);
                var order = D.attr(_target,'data-order');
                var sort = D.attr(_target,'data-sort');
                that.sort(sort,order);
            }
            ,execFilter:function(target){
                var that = this;
                that.changeTagView(target);
                var coms = D.attr(target,'data-coms');
                that.filter(coms);
            }
            ,changeTagView:function(t){
                var that = this;
                that.clearTags();
                that.clearBtns();
                D.addClass(t,'tag-current');
            }
            ,clearTags:function(){
                var that = this;
                D.removeClass(S.get('.tag-current',component),'tag-current');
            }
            ,clearBtns:function(){
                var that = this;
                D.removeClass(S.get('.active',controls),'active');
            }
            ,changeBtnView:function(t){
                var that = this;
                that.clearBtns();
                D.addClass(t,'active');
            }
            ,bindEvent:function(){
                var that = this;
                E.delegate(controls,'click','.ks-button',function(e){
                    var _target = e.currentTarget;
                    that.execSort(_target);
                });
                E.delegate('.component','click','.J_Tag',function(e){
                    var _target = e.currentTarget;
                    that.execFilter(_target);
                });
                E.on(search,'keyup',function(e){
                    var letter;
                    var _target = e.target;
                 
                    letter = D.val(_target);
                    that.range.clear();
                    if (letter === '') {
                        S.each(listItem,function(i){
                            D.show(i);
                        })
                        that.autoResponsive.adjust();
                        return;
                    }
                    S.each(listItem,function(i) {
                      var d, data, reg, _i, _len;
                      data = [D.attr(i,'data-name'), D.attr(i,'data-desc'), D.attr(i,'data-author')];
                      reg = new RegExp(letter);
                      for (_i = 0, _len = data.length; _i < _len; _i++) {
                        d = data[_i];
                        if (reg.test(d)) {
                            that.range.filter({
                                dataAttr:data,
                                attrName:['data-name','data-desc','data-author'],
                                hide:true
                            });
                          D.show(i);
                        }
                      }
                    });
                    that.autoResponsive.adjust();
                });
            }
            ,sort:function(type,order){
                var that = this;
                function checkOrder(condition){
                    return order=='asc'? !condition:condition;
                }
                function filterCondition(c){
                    var r;
                    r = parseInt(c).toString() == 'NaN'? c.toLowerCase() : parseInt(c)
                    return r;
                }
                S.each(listItem,function(i){
                    D.show(i);
                })
                that.range.clear();
                that.range.custom(function(queue,index,items){
                    for(var i =0;i<queue.length;i++){
                        if(checkOrder(filterCondition(D.attr(items[queue[i]],type)) > filterCondition(D.attr(items[index],type)))){
                            return i;
                        }
                    }
                });
                that.autoResponsive.adjust();
            }
            ,filter:function(coms){
                var that = this;
                var coms = that.distinct(coms.split(','));
                that.range.filter({
                    dataAttr:coms,
                    attrName:['data-name'],
                    hide:true
                });
                that.autoResponsive.adjust();
            }
            ,distinct :function(arrObj) {
                var sameObj = function(a, b) {
                    var tag = true;
                    if (!a || !b) return false;
                        for (var x in a) {
                            if (!b[x])
                            return false;
                        if (typeof (a[x]) === 'object') {
                            tag = sameObj(a[x], b[x]);
                        } else {
                            if (a[x] !== b[x])
                            return false;
                        }
                    }
                    return tag;
                }
                var newArr = [], obj = {};
                for (var i = 0, len = arrObj.length; i < len; i++) {
                    if (!sameObj(obj[typeof (arrObj[i]) + arrObj[i]], arrObj[i])) {
                        newArr.push(arrObj[i]);
                        obj[typeof (arrObj[i]) + arrObj[i]] = arrObj[i];
                    }
                }
                return newArr;
            }
        });
        return Layout;
    },{requires:[
        'node',
        'gallery/autoResponsive/1.3/base',
        'gallery/autoResponsive/1.3/plugin/sort',
        'dom',
        'event'
        ]
    });
    //直接布局
    S.use('gallery-page/layout',function(S,Layout){
        new Layout();
    });
});
