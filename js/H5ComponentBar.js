/* 柱图组件对象 */
var H5ComponentBar = function(name,cfg){
	var component = new H5ComponentBase(name,cfg);

	$.each(cfg.data,function(index,item){

		var line = $('<div class="line"></div>');
		var name = $('<div class="name"></div>');
		var rate = $('<div class="rate"></div>');
		var per = $('<div class="per"></div>');
		//避免rate为1时元素占满组件，将name和per挤下去
		var width = item[1]*50+'%';

		var bgStyle = '';
		if(item[2]){
			bgStyle = 'style="background-color:'+item[2]+'"';
		}
		rate.html('<div class="bg"'+bgStyle+'></div>');//负责展现动画
		rate.css({'width':width});
		name.text(item[0]);
		per.text(item[1]*100+'%');

		line.append(name).append(rate).append(per);
		component.append(line);
	})
	return component;
}