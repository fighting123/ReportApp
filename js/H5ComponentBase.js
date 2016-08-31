/* 基本图文组件对象 */

var H5ComponentBase = function(name,cfg){
	var cfg = cfg || {};
	var id = ('h5_c_'+Math.random()).replace('.','_');
	//所有配置信息
	//把当前的组件类型添加到样式中进行标记
	var cls = 'h5_component_name_'+name+' h5_component_'+cfg.type;
	var component = $('<div class="h5_component '+cls+'" id="'+id+'"></div>');

	cfg.text && component.text(cfg.text);
	cfg.width && component.width(cfg.width/2);
	cfg.height && component.height(cfg.height/2);
    
    cfg.css && component.css(cfg.css);
    cfg.bg && component.css('backgroundImage','url('+cfg.bg+')');

    if(cfg.center){
    	component.css({
    		marginLeft:(cfg.width/4 * -1) + 'px',
    		left:'50%'
    	})
    }

    if(typeof cfg.onclick === 'function')
        component.on('click',cfg.onclick);
    
    if(cfg.relativeTo){
        var parent = $('body').find('.h5_component_name_'+cfg.relativeTo);
        var position = {
            left: $(parent)[0].offsetLeft,
            top: $(parent)[0].offsetTop
        };
        if(cfg.center === true){
            position.left = 0;
        }
        component.css('transform','translate('+position.left+'px,'+position.top+'px)');
    }




    //设置事件
    component.on({
    	onLoad: function(){
    		setTimeout(function(){
                component.removeClass(cls+'_leave').addClass(cls+'_load');
                cfg.animateIn && component.animate(cfg.animateIn)
            },cfg.delay || 0);
    		return false;
    	},
    	onLeave: function(){
    		setTimeout(function(){
                component.removeClass(cls+'_load').addClass(cls+'_leave');
                cfg.animateOut && component.animate(cfg.animateOut)
            },cfg.delay || 0);
    		return false;
    	}
    })
	return component;
}