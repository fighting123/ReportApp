/* 内容管理对象 */
var jdata = [];
var H5 = function(){
	this.id = ('h5_' + Math.random()).replace('.','_');
	this.el = $('<div class="h5" id="'+this.id+'"></div>').hide();
	this.page = [];
	$('body').append(this.el);

	/**
	 * 新增一个页面
	 * @param {string} name 组件的名称，会加入到className中
	 * @param {string} text 页内的默认文本
	 * @return {H5} H5对象，可以重复使用H5对象支持的办法
	*/
	this.addPage = function(name,text){
		jdata.push({isPage:true,name:name,text:text});
		var page = $('<div class="h5_page section">');

		if(name != undefined){
			page.addClass('h5_page_'+name)
		}
		if(text != undefined){
			page.text(text);
		}
		//this的指向问题
		this.el.append(page);
		this.page.push(page);
		if(typeof this.whenAddPage === 'function'){
			this.whenAddPage();
		}
		//实现链式调用
		return this;
	}
	//新增一个组件
	this.addComponent = function(name,cfg){
		jdata.push({isPage:false,name:name,cfg:cfg});
		var cfg = cfg || {};
		//如果config什么都没有传入的话，或者传入的参数没有type的话，他会默认加入一个值为base的type
		cfg = $.extend({
			type:'base'
		},cfg);
		var component;//定义一个变量，存储组件元素
		var page = this.page.slice(-1)[0];    //获取最后一个page，不知道数组长度时候想获取最后一个元素用-1
		switch(cfg.type){
			case 'base':
				component = new H5ComponentBase(name,cfg);
				break;
			case 'polyline':
				component = new H5ComponentPolyline(name,cfg);
				break;
			case 'pie':
				component = new H5ComponentPie(name,cfg);
				break;
			case 'bar':
				component = new H5ComponentBar(name,cfg);
				break;
			case 'bar_v':
				component = new H5ComponentBar_v(name,cfg);
				break;
			case 'point':
				component = new H5ComponentPoint(name,cfg);
				break;
			case 'radar':
				component = new H5ComponentRadar(name,cfg);
				break;
			case 'ring':
				component = new H5ComponentRing(name,cfg);
				break;
				default:
		}
		page.append(component);
		return this;
	}
	//H5对象初始化呈现,之所以把先隐藏在loader是因为h5对象承载着组织管理的功能，有可能会加载若干个资源，
	//用loder的话如果将来有很多图片资源，会等资源加载完成之后再显示
	this.loader = function(firstPage){
		this.el.fullpage({
			onLeave: function(index,nextIndex,direction){
				$(this).find('.h5_component').trigger('onLeave');
			},
			afterLoad: function(anchorLink,index){
				$(this).find('.h5_component').trigger('onLoad');
			}
		});
		this.page[0].find('.h5_component').trigger('onLoad');
		this.el.show();
		if(firstPage){
			$.fn.fullpage.moveTo(firstPage);
		}
	};
	//加入loading动画
	this.loader = typeof H5_loading === 'function' ? H5_loading : this.loader;
	return this;
};