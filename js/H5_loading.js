//等全部图片加载完成之后才进入页面
var H5_loading = function(images,firstPage){
   
	var id = this.id;
	if(this._images === undefined){   //第一次进入
		
		this._images = (images || []).length;
		this._loaded = 0;  //已经加载的图片数量
		
		window[id] = this;  //把当前对象存储在全局对象window中，用来进行某个图片加载完成后的回调

		for(i in images){
			var item = images[i];
			var img = new Image;
			img.onload = function(){
				window[id].loader();
			};
			img.src = item;   //可以直接把图片载入到缓存里面
		}

		$('#rate').text('0%');
		return this;
	}else{
		this._loaded++;
		$('#rate').text((this._loaded/this._images * 100) >> 0 + '%');
		if(this._loaded<this._images){
			return this;
		}
	}
	window[id] = null;

	//原H5的loader函数，初始化
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
}