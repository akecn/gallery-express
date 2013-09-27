/*! autoResponsive - v1.3 - 2013-09-27 11:44:23 AM
* Copyright (c) 2013 xudafeng; Licensed  */
KISSY.add("gallery/autoResponsive/1.3/anim",function(e){"use strict";function t(e){this.cfg=e,this._init()}var n=e.DOM,i=e.Anim,r=11>e.UA.ie,o=["-webkit-","-moz-","-ms-","-o-",""],a=r?"fixedAnim":"css3Anim";return e.augment(t,{_init:function(){this[this.cfg.animType?this.cfg.animType:a]()},cssPrefixes:function(e,t){for(var n={},i=0,r=o.length;r>i;i++)n[o[i]+e]=t;return n},css3Anim:function(){var t=this.cfg;n.css(t.elm,this.cssPrefixes("transform","translate("+("right"!==t.direction?t.x:t.owner.gridSort.containerWH-t.elm.__width-t.x)+"px,"+t.y+"px) ")),this._fireAfterUnitArrange(t),e.log("css3 anim success")},fixedAnim:function(){var t=this,n=t.cfg,r={top:n.y};return n.closeAnim?(this.noneAnim(),void 0):(r["right"==n.direction?"right":"left"]=n.x,new i(n.elm,r,n.duration,n.easing,function(){t._fireAfterUnitArrange(n)}).run(),e.log("kissy anim success"),void 0)},noneAnim:function(){var t=this.cfg;n.css(t.elm,{left:t.x,top:t.y}),this._fireAfterUnitArrange(t),e.log("maybe your anim is closed")},_fireAfterUnitArrange:function(e){e.owner.fire("afterUnitArrange",{autoResponsive:{elm:e.elm,position:{x:e.x,y:e.y},frame:e.owner.frame}})}}),t},{requires:["dom","anim"]}),KISSY.add("gallery/autoResponsive/1.3/linkedlist",function(e){"use strict";function t(e){var t=this;t.length=0,t.head=null,t.tail=null,t.type=e.type||!0,t.query=[],t.init()}return e.augment(t,{init:function(){},add:function(e){var t=this;if(t.type)return t.query.push(e),void 0;var n={value:e,next:null,prev:null};0==t.length?t.head=t.tail=n:(t.tail.next=n,n.prev=t.tail,t.tail=n),t.length++},remove:function(e){var t=this;if(e>t.length-1||0>e)return null;var n=t.head,i=0;if(0==e)t.head=n.next,null==t.head?t.tail=null:t.head.previous=null;else if(e==t.length-1)n=t.tail,t.tail=n.prev,t.tail.next=null;else{for(;e>i++;)n=n.next;n.prev.next=n.next,n.next.prev=n.prev}t.length--},get:function(e){var t=this;return t.type?t.query[e]:t.node(e).value},node:function(e){var t=this;if(e>t.length-1||0>e)return null;for(var n=t.head,i=0;e>i++;)n=n.next;return n},update:function(e,t){var n=this;return n.type?(n.query[e]=t,void 0):(n.node(e).value=t,void 0)},size:function(){return this.query.length||this.length}}),t}),KISSY.add("gallery/autoResponsive/1.3/gridsort",function(e,t,n){"use strict";function i(){}var r=e.DOM,o="";return i.prototype={init:function(t,n){this.cfg=t,t.owner=n;var i=e.query(t.selector,t.container);switch(t.sortBy){case o:case"grid":default:this._gridSort(i);break;case"cell":this._cellSort(i)}},_gridSort:function(t){var n=this.cfg,i=this._getCols();this._setFrame();var r=[];n.owner.fire("beforeLocate",{autoResponsive:{actions:r,elms:t}}),n.owner.fire("beforeArrange",{autoResponsive:{elms:t}});var o=r.length,a=t.length,s=n.cache?n.owner._lastPos:0,u=s,c=e.noop;if(0==o){n.owner.on("afterUnitArrange",c=function(){++u>=a&&(n.owner.detach("afterUnitArrange",c),u==a&&n.owner.fire("afterArrange",{autoResponsive:{elms:t,frame:n.owner.frame}}))});for(var l=s;a>l;l++)this._render(i,t[l])}else{var f=[];r.push("_tail");for(var d=s;a>d;d++)for(var h,g=0;o+1>g;g++){if(h=("function"==typeof r[g]?r[g]:this[r[g]])(f,d,t),"number"==typeof h){f.splice(h,0,d);break}if("boolean"==typeof h&&h)break}u=0,n.owner.on("afterUnitArrange",c=function(){++u>=p&&(n.owner.detach("afterUnitArrange",c),u==p&&n.owner.fire("afterArrange",{autoResponsive:{elms:t,frame:n.owner.frame}}))});for(var v=0,p=f.length;p>v;v++)this._render(i,t[f[v]])}n.owner._lastPos=a;var _=this._getMinMaxColHeight();n.owner.fire("afterLocate",{autoResponsive:{elms:t,curMinMaxColHeight:_,frame:n.owner.frame}}),this.setHeight(_.max)},_getCols:function(){var e=this.cfg;if(this.containerWH=e.landscapeOrientation?r.outerHeight(e.container):r.outerWidth(e.container),e.owner.curQuery&&e.cache)return e.owner.curQuery;for(var t=new n({}),i=0,o=Math.ceil(this.containerWH/e.gridWidth);o>i;i++)t.add(0);return e.owner.curQuery=t},_setFrame:function(){this.cfg.owner.frame++},_tail:function(){return 1/0},_render:function(e,t){var n=this,i=n.cfg;i.owner.fire("beforeUnitLocate beforeUnitArrange",{autoResponsive:{elm:t,frame:i.owner.frame}});var r=n.coordinate(e,t);i.owner.fire("afterUnitLocate",{autoResponsive:{elm:t,frame:i.owner.frame}}),n.asyncize(function(){n.callAnim(t,r)})},coordinate:function(e,t){var n=this.cfg,i=n.isRecountUnitWH,o=n.owner.get("fixedSize");return(i||!t.__width)&&(t.__width=o.width?o.width:r.outerWidth(t),t.__height=o.height?o.height:r.outerHeight(t)),this._autoFit(e,t.__width,t.__height)},_autoFit:function(e,t,n){for(var i,r=this.cfg,o=Math.ceil(((r.landscapeOrientation?n:t)+r.unitMargin.x)/r.gridWidth),a=this._getCur(o,e),s=a[0],u=o+a[0],c=a[1]+(r.landscapeOrientation?t:n)+r.unitMargin.y;u>s;s++)e.update(s,c);return i=[a[0]*r.gridWidth,a[1]],r.landscapeOrientation?i.reverse():i},_getCur:function(e,t){return this._skipALG(e,t)},_stepALG:function(e,t){for(var n=[null,1/0],i=0,r=t.size();r-e+1>i;i++){for(var o=0,a=i;i+e>a;a++)t.get(a)>o&&(o=t.get(a));n[1]>o&&(n=[i,o])}return n},_skipALG:function(e,t){for(var n=1/0,i=0,r=t.size(),o=0;(e>r?0:r-e)>=o;o++){for(var a,s=-1/0,u=0;e>u;u++)if(a=t.get(o+u),a>=n){if(o+=u+1,o>r-e){s=n;break}u=-1,s=-1/0}else a>s&&(s=a);n>s&&(n=s,i=o)}return[i,n]},asyncize:function(e){var t=this,n=t.cfg;n.owner.get("suspend")?setTimeout(function(){e.call(t)},0):e.call(t)},callAnim:function(e,n){var i=this.cfg;new t({elm:e,x:n[0],y:n[1],closeAnim:i.closeAnim,duration:i.duration,easing:i.easing,direction:i.direction,frame:i.owner.frame,owner:i.owner,animType:i.animType}),e.autoResponsiveCoordinate={x:n[0],y:n[1]}},_getMinMaxColHeight:function(){var e=this.cfg,t=1/0,n=e.owner.curQuery.query,i=Math.max.apply(Math,n);if(0==i)t=0;else for(var r=0,o=n.length;o>r;r++)0!=n[r]&&t>n[r]&&(t=n[r]);return{min:t,max:i}},setHeight:function(e){var t=this.cfg;t.autoHeight&&(t.landscapeOrientation?r.width(t.container,e):r.height(t.container,e))},_cellSort:function(t){var n=this,i=[];e.each(t,function(){e.log("star from here!"),i.push(n._getCells())})},_getCells:function(){return this._getCols()}},i},{requires:["./anim","./linkedlist","dom"]}),KISSY.add("gallery/autoResponsive/1.3/base",function(e,t,n){"use strict";function i(){return i.superclass.constructor.apply(this,arguments),e.get(this.get("container"))?(this.fire("beforeInit",{autoResponsive:this}),this.get("autoInit")&&this.init(),this.fire("afterInit",{autoResponsive:this}),void 0):(e.log("can not init, lack of container!"),void 0)}var r=e.DOM,o=e.Event,a=window,s="",u={container:{value:s},selector:{value:s},filter:{value:s},fixedSelector:{value:s},priority:{value:s},gridWidth:{value:10},unitMargin:{value:{x:0,y:0}},closeAnim:{value:!1},duration:{value:1},easing:{value:"easeNone"},direction:{value:"left"},sortBy:{value:s},autoHeight:{value:!0},closeResize:{value:!1},autoInit:{value:!0},plugins:{value:[]},suspend:{value:!0},cache:{value:!1},resizeFrequency:{value:200},whensRecountUnitWH:{value:[]},delayOnResize:{value:-1},landscapeOrientation:{value:!1},exclude:{value:s},animType:{value:s},fixedSize:{value:{}}};return e.extend(i,n,{init:function(){this._bindEvent(),this.initPlugins(),this.render(),e.log("AutoResponsive init!")},initPlugins:function(){for(var e,t=0,n=this.get("plugins"),i=n.length;i>t;t++)e=n[t],e.init(this)},render:function(){var n=this.getAttrVals(),i=this.get("whensRecountUnitWH");n.isRecountUnitWH=!!i.length,this.frame=this.frame||0,arguments[0]&&e.each(arguments[0],function(e,t){n[t]=e}),this.gridSort=this.gridSort||new t,this.gridSort.init(n,this)},_bind:function(t){var n=this,i=n.get("whensRecountUnitWH");n.get("closeResize")||o.on(a,"resize",function(){t.call(n,{isRecountUnitWH:e.inArray("resize",i)})})},_bindEvent:function(){var t=this;t._bind(e.buffer(function(){var e=t.get("delayOnResize");t.fire("beforeResize"),-1!==e?setTimeout(function(){t.render(arguments)},e):t.render(arguments),t.fire("resize")},t.get("resizeFrequency"),t))},adjust:function(t){var n=this.get("whensRecountUnitWH");this.__isAdjusting=1,this.render({isRecountUnitWH:t||e.inArray("adjust",n)}),this.__isAdjusting=0,e.log("adjust success")},isAdjusting:function(){return this.__isAdjusting||0},margin:function(e){this.render({unitMargin:e})},direction:function(e){this.render({direction:e})},changeCfg:function(t){var n=this;e.each(t,function(e,t){n.set(t,e)})},append:function(e){r.append(e,this.get("container")),this.render({cache:!0})},prepend:function(e){r.prepend(e,this.get("container")),this.render()}},{ATTRS:u}),i},{requires:["./gridsort","base","dom","event"]}),KISSY.add("gallery/autoResponsive/1.3/plugin/hash",function(e){"use strict";function t(e){var t=this;t.prefix=e.prefix||"ks-"}var n="&";return e.augment(t,{init:function(t){var n=this;n.owner=t,e.log("hash init!"),n.hasHash()&&n.parse()},hasHash:function(){return location.hash?!0:!1},parse:function(){var e=this;e.getParam()},getParam:function(){var t=this;t.hash=location.hash.split(n),e.each(t.hash,function(e){t.getPriority(e),t.getFilter(e)})},getPriority:function(e){var t=this,n=t.prefix+"priority";-1!=e.indexOf(n)},getFilter:function(e){var t=this,n=t.prefix+"filter";-1!=e.indexOf(n)}}),t},{requires:["event"]}),KISSY.add("gallery/autoResponsive/1.3/util",function(e){"use strict";var t={};return e.mix(t,{debounce:function(e,t,n,i){var r;return function(){function o(){i||e.apply(a,s),r=null}var a=n||this,s=arguments;r?clearTimeout(r):i&&e.apply(a,s),r=setTimeout(o,t||100)}},timedChunk:function(t,n,i,r){var o,a={},s=[],u=i.config,c=u.qpt||15;return a.start=function(){s=s.concat(e.makeArray(t));var u=function(){for(var e=+new Date;s.length>0&&50>new Date-e;){var l=s.splice(0,c);n.call(i,l)}return s.length>0?(o=setTimeout(u,25),void 0):(r&&r.call(i,t),a.stop(),a=null,void 0)};u()},a.stop=function(){o&&(clearTimeout(o),s=[])},a}}),t}),KISSY.add("gallery/autoResponsive/1.3/plugin/drag",function(e,t,n,i){"use strict";function r(e){var t=this;t.closeConstrain=e.closeConstrain||!1,t.selector=e.selector,t.handlers=e.handlers||[],t.threshold=e.threshold||300}var o=e.DOM,a=e.DD,s=a.DDM,u=a.DraggableDelegate,c=a.DroppableDelegate,l="ks-autoResponsive-dd-",f=l+"placeHolder",d=l+"dragging",h='<div class="'+f+'"></div>';return r.prototype={init:function(i){var r=this;r.owner=i,r.owner.changeCfg({animType:"fixedAnim"}),r.container=r.owner.userConfig.container,r.dragDelegate=new u({container:r.container,selector:r.selector,move:!0,plugins:[new t({constrain:r.container}),new n({node:r.container})],handlers:r.handlers}),r.dropDelegate=new c({container:r.container,selector:r.selector}),r._bindOperate(),e.log("drag init!")},changCfg:function(t){var n=this;e.each(t,function(e,t){n.dragDelegate.set(t,e)})},stop:function(){var e=this;e.dragDelegate.set("disabled",!0)},restore:function(){var e=this;e.dragDelegate.set("disabled",!1)},_bindOperate:function(){var e=this;s.on("dragstart",e._debounce(e._dragStartOperate)).on("dragend",e._debounce(e._dragEndOperate)).on("dropover",e._debounce(e._dropOverOperate))},_dragStartOperate:function(e){var t=this,n=e.drag,i=n.get("node");t.select=i[0],t.originPosition=t.select.autoResponsiveCoordinate,t._renderPlaceHolder(),o.addClass(t.select,d),t.owner.changeCfg({exclude:d})},_dragEndOperate:function(){var e=this;o.css(e.select,{left:o.css(e.placeHolder,"left"),top:o.css(e.placeHolder,"top")}),o.insertBefore(e.select,e.placeHolder),o.remove(e.placeHolder),o.removeClass(e.select,d)},_dropOverOperate:function(e){var t=this,n=e.drop,i=n.get("node");o.insertBefore(t.placeHolder,i),t.owner.adjust()},_renderPlaceHolder:function(){var e=this;e.placeHolder=o.create(h),o.css(e.placeHolder,{left:e.originPosition.x,top:e.originPosition.y,width:o.width(e.select),height:o.height(e.select)}),o.insertBefore(e.placeHolder,e.select)},_debounce:function(e){var t=this,n=t.threshold;return i.debounce(e,n,t,!0)}},r},{requires:["dd/plugin/constrain","dd/plugin/scroll","../util","dd","dom","event"]}),KISSY.add("gallery/autoResponsive/1.3/plugin/loader",function(e,t){"use strict";function n(e){return this instanceof n?(this._makeCfg(e),void 0):new n(e)}var i=e.DOM,r=e.Event,o=window,a=50;return e.augment(n,e.EventTarget,{init:function(e){this.owner=e,this.__bindMethods(),this._reset()},_reset:function(){var e=this,t=e.config,n=t.mod;e.__started=e.__destroyed=e.__stopped=0,"manual"===n||(e.__onScroll(),e.start())},_makeCfg:function(t){t={load:"function"==typeof t.load?t.load:function(){e.log("AutoResponsive.Loader::_makeCfg: the load function in user's config is undefined!","warn")},diff:t.diff||0,mod:"manual"==t.mod?"manual":"auto",qpt:15},this.config=t},changeCfg:function(t){this.stop(),this._makeCfg(e.merge(this.config,t)),this._reset()},__doScroll:function(){var t=this,n=t.owner,r=t.config;if("up"!==t.__scrollDirection&&(e.log("AutoResponsive.Loader::__doScroll..."),!t.__loading)){if(n.isAdjusting())return t.__onScroll(),void 0;var a=e.get(n.get("container"));if(a.offsetWidth){var s=i.offset(a).top,u=r.diff,c=n.getMinColHeight(),l=i.scrollTop(o),f=i.height(o);u+l+f>=s+c&&t.load()}}},load:function(){function t(e,t){i.__addItems(e,function(){t&&t.call(i),i.__doScroll()}),i.__loading=0}function n(){i.stop()}var i=this,r=i.config,o=r.load;return i.__stopped?(e.log("AutoResponsive.Loader::load: this loader has stopped, please to resume!","warn"),void 0):(e.log("AutoResponsive.Loader::loading..."),i.__loading=1,o&&o(t,n),void 0)},isLoading:function(){return this.__loading},isStarted:function(){return this.__started},isStopped:function(){return this.__stopped},isDestroyed:function(){return this.__destroyed},__addItems:function(e,n){var i=this;t.timedChunk(e,i.__appendItems,i,function(){n&&n.call(i),i.fire("autoresponsive.loader.complete",{items:e})}).start()},__appendItems:function(t){var n=this,i=n.owner;t=e.makeArray(t),i.append(t)},__bindMethods:function(){var e=this,n=e.owner,i={min:0,max:0};n.on("afterLocate",function(e){i=e.autoResponsive.curMinMaxColHeight}),n.getMaxColHeight=function(){return i.max},n.getMinColHeight=function(){return i.min},e.__onScroll=t.debounce(e.__doScroll,a,e,!0),e.__onMouseWheel=function(t){e.__scrollDirection=t.deltaY>0?"up":"down"}},start:function(){r.on(o,"mousewheel",this.__onMouseWheel),this.resume()},stop:function(){this.pause(),r.detach(o,"scroll",this.__onMouseWheel),this.__stopped=1},pause:function(){this.__destroyed||r.detach(o,"scroll",this.__onScroll)},resume:function(){var e=this;e.__destroyed||(r.on(o,"scroll",e.__onScroll),e.__started=1,e.__stopped=0)},destroy:function(){this.__destroyed=1}}),n},{requires:["../util","dom","event"]}),KISSY.add("gallery/autoResponsive/1.3/plugin/sort",function(e){"use strict";function t(e){return this instanceof t?(this._makeCfg(e),void 0):new t(e)}var n=e.DOM,i={};return e.augment(t,{init:function(t){var n=this;n.owner=t,n.actions=[],n.owner.on("beforeLocate",function(e){n.elms=e.autoResponsive.elms;for(var t=0;n.actions.length>t;t++)e.autoResponsive.actions.push(n.actions[t])}),e.log("plugin sort::init")},_makeCfg:function(e){e=i,this.config=e},changeCfg:function(t){this._makeCfg(e.merge(this.config,t))},random:function(){var e=this;e.clear(),e.actions.push(function(e){return parseInt(Math.random()*e.length)})},priority:function(t){var i=this,r=t.attrName||"data-priority",o=[],a=-1;e.each(i.elms,function(e){(t.dataAttr&&n.attr(e,r)==t.dataAttr||n.hasClass(e,t.classAttr))&&o.push(e)}),i.actions.push(function(t,n,i){return e.inArray(i[n],o)?(a++,a):t.length})},reverse:function(){var e=this;e.actions.push(function(){return 0})},filter:function(t){var i=this;i.clear();for(var r=t.attrName||["data-filter"],o=0;r.length>o;o++){var a=r[o]||"data-filter";i.actions.push(function(i,r,o){if(n.hasAttr(o[r],a)&&n.attr(o[r],a)==t.dataAttr)n.show(o[r]);else if(n.hasClass(o[r],t.classAttr))n.show(o[r]);else{if(!e.inArray(n.attr(o[r],a),t.dataAttr))return t.hide&&n.hide(o[r]),!0;n.show(o[r])}})}},custom:function(e){var t=this;t.actions.push(e)},clear:function(){var e=this;e.actions=[]},restore:function(){var e=this;e.actions.pop()}}),t},{requires:["dom"]}),KISSY.add("gallery/autoResponsive/1.3/index",function(e,t,n,i,r,o){return t.Hash=n,t.Drag=i,t.Loader=r,t.Sort=o,t},{requires:["./base","./plugin/hash","./plugin/drag","./plugin/loader","./plugin/sort"]});








/**
 * gallery 主页自适应排序布局
 * 主页地址：http://gallery.kissyui.com/autoResponsive/1.3/guide/index.html
 * dafeng.xdf@taobao.com
 */
;KISSY.ready(function(S){
    S.add('gallery-page/layout',function(S,Auto,Sort){
        var D = S.DOM,E = S.Event;
        var container = S.get('#J_List');
        var controls = S.get('.controls');
        var search = S.get('#J_Search');
        var listItem = D.query('li',container);
        var item = '.item';

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
            }
            ,bindEvent:function(){
                var that = this;
                E.delegate(controls,'click','.ks-button',function(e){
                    var _target = e.currentTarget;
                    var order = D.attr(_target,'data-order');
                    var sort = D.attr(_target,'data-sort');
                    that.sort(sort,order);
                });
                E.delegate('.component','click','.J_Tag',function(e){
                    var _target = e.currentTarget;
                    var coms = D.attr(_target,'data-coms');
                    that.filter(coms);
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

