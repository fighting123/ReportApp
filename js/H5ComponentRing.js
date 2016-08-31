/* 环图组件对象 */

var H5ComponentRing =function ( name, cfg ) {


  if(cfg.data.length>1){  //  环图应该只有一个数据
    cfg.data = [cfg.data[0]];
  }

  //重设配置中的 type 参数，不仅利用 H5ComponentPie 构建 DOM 结构和 JS 逻辑，也使用其 CSS 样式定义
  cfg.type = 'pie';
  var component =  new H5ComponentPie( name ,cfg );

  //修正组件的样式，以支持在样式文件中组件的样式定义 .h5_component_ring 相关样式能生效
  component.addClass('h5_component_ring');

  
  var mask = $('<div class="mask">');

  //把创建好的遮罩元素添加到组件中
  component.append(mask);

  var text = component.find('.text');

  text.attr('style','');
  if(cfg.data[0][2]){
    text.css('color',cfg.data[0][2]);
  }
  // 在遮罩元素( .mask ) 中添加文本信息
  mask.append( text );

  return component;
}