/* 饼图组件对象 */

var H5ComponentPie = function(name,cfg){
	var component = new H5ComponentBase(name,cfg);

	//绘制网格线
	var w = cfg.width;
	var h = cfg.height;
	//加入一个画布--底图层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	var r = w/2;
	ctx.beginPath();
	ctx.fillStyle = '#eee';
	ctx.strokeStyle = '#eee';
	ctx;lineWidth = 1;
	ctx.arc(r,r,r,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();

	//绘制一个数据层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	var colors = ['red','green','blue','orange','gray'];
	var sAngle = 1.5 * Math.PI;//设置开始的角度在12点位置
	var eAngle = 0;//结束角度
	var aAngle = Math.PI * 2;//100%的圆结束的角度 2PI = 360；	


	var step = cfg.data.length;
	for(var i=0;i<step;i++){

		var item = cfg.data[i];
		var color = item[2] || (item[2] = colors.pop());
		
		eAngle = sAngle + aAngle * item[1];//画弧

		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx;lineWidth = .1;
		ctx.moveTo(r,r);
		ctx.arc(r,r,r,sAngle,eAngle);
		ctx.fill();
		ctx.stroke();

		sAngle = eAngle;//每次画完之后需要重新定义起始角度
	
		//加入所有项目文本以及百分比
		var text = $('<div class="text"></div>');
		text.text(item[0]);
		var per = $('<div class="per"></div>');
		per.text(item[1]*100 + '%');
		text.append(per);

		var x = r + Math.sin(0.5 * Math.PI - sAngle) * r;
		var y = r + Math.cos(0.5 * Math.PI - sAngle) * r;
		
		//修正左侧文本位置
		if(x>w/2){
			text.css('left',x/2);
		}else{
			text.css('right',(w-x)/2);
		}
		//修正上侧文本位置
		if(y>h/2){
			text.css('top',y/2);
		}else{
			text.css('bottom',(h-y)/2+10);
		}
		//加上颜色
		if(item[2]){
			text.css('color',item[2]);
		}
		//text的动画，在图像加载完成之后显示
		text.css('opacity',0);
		component.append(text);
	}

	//加入一个蒙版层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	$(cns).css({'zIndex':3});
	component.append(cns);


	ctx.fillStyle = '#eee';
	ctx.strokeStyle = '#eee';
	ctx;lineWidth = .1;


	//生长动画
	var draw = function(per){
		//清除画布
		ctx.clearRect(0,0,w,h);
		ctx.beginPath();
		ctx.moveTo(r,r);
		if(per<=0){
			ctx.arc(r,r,r,0,Math.PI*2);
			component.find('.text').css('opacity',0);
		}else{
			ctx.arc(r,r,r,sAngle,sAngle + Math.PI*2*per,true);
		}
		ctx.fill();
		ctx.stroke();
		if(per>=1){
			component.find('.text').css('transition','all 0s');
			//在文本加载之前进行文本重排
			H5ComponentPie.reSort(component.find('.text'));
			component.find('.text').css('transition','all 1s');
			//在饼图加载完成加载文本
			component.find('.text').css('opacity',1);
			ctx.clearRect(0,0,w,h);
		}
	}

	draw(0);//让其刚开始时显示蒙版层
	component.on({
		//饼图生长动画
		onLoad:function(){
			var s = 0;
			for(i=0;i<100;i++){
				setTimeout(function(){
					s+=.01;
					draw(s);
				},i*10+500)
			}
		},
		onLeave:function(){
			var s = 1;
			for(i=0;i<100;i++){
				setTimeout(function(){
					s-=.01;
					draw(s);
				},i*10)
			}
		}
	});

	return component;

}

//重排项目文本元素(在文本元素显示出来之前调用此函数)
H5ComponentPie.reSort = function(list){
	
	//1.检测相交
	var compare = function(domA,domB){
		//元素的位置，不用left，因为css获取的left值为具体设定的值，有时候 left为auto
		var offsetA = $(domA).offset();
		var offsetB = $(domB).offset();
		//domA的投影
		var shadowA_x = [ offsetA.left,$(domA).width() + offsetA.left ];
		var shadowA_y = [ offsetA.top,$(domA).height() + offsetA.top ];
		//domB的投影
		var shadowB_x = [ offsetB.left,$(domB).width() + offsetB.left ];
		var shadowB_y = [ offsetB.top,$(domB).height() + offsetB.top ];
	
		//检测x
		var intersect_x = (shadowA_x[0]>shadowB_x[0]&&shadowA_x[0]<shadowB_x[1]) ||
						   (shadowA_x[1]>shadowB_x[0]&&shadowA_x[1]<shadowB_x[1]);
		//检测y
		var intersect_y = (shadowA_y[0]>shadowB_y[0]&&shadowA_y[0]<shadowB_y[1]) ||
						   (shadowA_y[1]>shadowB_y[0]&&shadowA_y[1]<shadowB_y[1]);
		return intersect_x&&intersect_y;				   
	}
	//2.错开重排
	var reset = function(domA,domB){
		if($(domA).css('top') != 'auto'){
			$(domA).css('top',parseInt($(domA).css('top')) + $(domB).height());
		}
		if($(domA).css('bottom') != 'auto'){
			$(domA).css('bottom',parseInt($(domA).css('bottom')) + $(domB).height());

		}
	}
	//定义将要重排的元素

	var willReset = [list[0]];
	$.each(list,function(i,domTarget){

		if(compare(willReset[willReset.length-1],domTarget)){
			willReset.push(domTarget);    //不会把自身加入到对比
		}
	});

	if(willReset.length > 1){
		$.each(willReset,function(i,domA){
			if(willReset[i+1]){
				reset(domA,willReset[i+1]);
			}
		});
		H5ComponentPie.reSort(willReset);
	}
}











