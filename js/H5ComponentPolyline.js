/* 柱图组件对象 */

var H5ComponentPolyline = function(name,cfg){
	var component = new H5ComponentBase(name,cfg);

	//绘制网格线
	var w = cfg.width;
	var h = cfg.height;
	//加入一个画布--背景层（网格线背景）
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	//水平网格线 100份 -->10份
	var step = 10;
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#f00';
	for(var i=0;i<step+1;i++){

		var y =(h/step) * i;  //每一个网格线的高度
		ctx.moveTo(0,y);
		ctx.lineTo(w,y);
	}
	//垂直网格线（根据项目个数分）
	step = cfg.data.length+1;
	var text_w = Math.floor(w/step);//底部文本宽度

	for(var i=0;i<step+1;i++){
		var x = (w/step) * i;
		ctx.moveTo(x,0);
		ctx.lineTo(x,h);

		if(cfg.data[i]){
			var text = $('<div class="text"></div>');
			text.text(cfg.data[i][0]);

			text.css({'width':text_w/2,'left':(x/2+text_w/4)});
			component.append(text);
		}
	}
	ctx.stroke();

	//加入画布-数据层--绘制折现数据(重新添加一个canvas，因为之后的动画网格线不变，但是折线图是不断变化的，两个canvas方便画图)
		var cns = document.createElement('canvas');
		var ctx = cns.getContext('2d');
		cns.width = ctx.width = w;
		cns.height = ctx.height = h;
		component.append(cns);


	/**
	*  绘制折线以及对应的数据和阴影
	*  @param {floot} per 0到1之间的数据，会根据这个值绘制最终数据对应的中间状态
	*  @return {Dom} Component元素
	*/

	var draw = function(per){
		//清空画布
		ctx.clearRect(0,0,w,h);

		//绘制折线数据
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#ff8878';

		var x=0;
		var y=0;

		//画点
		var row_w = w/(cfg.data.length+1);
		for(i in cfg.data){
			var item = cfg.data[i];

			x = row_w*i + row_w;
			y = h-(h*per*(item[1]));
			ctx.moveTo(x,y);
			ctx.arc(x,y,5,0,2*Math.PI);
			ctx.fillStyle = '#ff8878';
			ctx.fill();
			ctx.stroke();

		}

		//连线
		//移动画笔到第一个数据的点位置
		ctx.beginPath();
		ctx.moveTo(row_w,h-(h*per*cfg.data[0][1]));
		for(i in cfg.data){
			var item = cfg.data[i];
			x = row_w*i + row_w;
			y = h-(h*per*(item[1]));
			ctx.lineTo(x,y);
		}
		ctx.stroke();

		ctx.lineWidth = 0;
		ctx.strokeStyle = 'rgba(255,136,120,0)';

		//绘制阴影
		ctx.lineTo(x,h);
		ctx.lineTo(row_w,h);
		ctx.fillStyle = 'rgba(255,136,120,.2)';
		ctx.fill();


		//写数据
		for(i in cfg.data){
			var item = cfg.data[i];
			x = row_w*i + row_w;
			y = h-(h*per*(item[1]));
			ctx.fillStyle = item[2] ? item[2] : '#595959';
			ctx.fillText((item[1]*100)+'%',x-5,y-15);
		}


		ctx.stroke();
	}


	component.on({
		//折线图生长动画
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
	})

	return component;
}