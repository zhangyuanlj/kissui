/*
 * 通用组件
 * author:张渊
 * modifyTime:2016-12-20
 */
Ks().package("K.Ui", function(Ks){
	this.Widget = Ks.creatClass({
		$widget : null,
		defaults : {},
		//获取视窗的大小
    	getViewSize : function(){
    		var $doc = $(document);
    		var $win = $(window);
    		var docW = $doc.width();
    		var docH = $doc.height();
    		var winW = $win.width();
    		var winH = $win.height();
    		return {
    			docW : docW,
    			docH : docH,
    			winW : winW,
    			winH : winH
    		};
    	},
		//设置配置参数 
		setOptions : function(options){
			if(!options){
				return false;
			}
			$.extend(true, this.defaults, options);
		},
		/**
		 * 设置控件宽度
		 * @param integer width 宽度
		 */
		setWidth : function(width){
			this.$widget.width(width);
		},
		/**
		 * 设置控件宽度
		 * @param integer height 宽度
		 */
		setHeight : function(height){
			this.$widget.height(height);
		},
		/**
		 * 设置控件大小
		 * @param integer width 宽度
		 * @param integer height 高度
		 */
		setSize : function(width, height){
			this.setWidth(width);
			this.setHeight(height);
		}, 
		/**
		 * 获取控件大小
		 * @return object 控件大小
		 */
		getSize : function(){
			var width = this.$widget.width(),
				height = this.$widget.height();
			if(width === null){
				width = 0;
			}
			if(height === null){
				height = 0;
			}
			return {
				width : width,
				height : height
			}
		}, 
		/**
		 * 设置控件横坐标
		 * @param integer left 横坐标
		 */
		setLeft : function(left){
			this.$widget.css("left", left ? left+"px" : left);
		},
		/**
		 * 设置控件纵坐标
		 * @param integer top 纵坐标
		 */
		setTop : function(top){
			this.$widget.css("top", top ? top+"px" : top);
		},
		/**
		 * 设置控件位置
		 * @param integer left 横坐标
		 * @param integer top 纵坐标
		 */
		setPosition : function(left, top){
			this.setLeft(left);
			this.setTop(top);
		},
		/**
		 * 获取控件位置
		 * @return object 元素位置
		 */
		getPosition : function(){
			var left = parseFloat(this.$widget.css("left")),
				top = parseFloat(this.$widget.css("top"));
			if(isNaN(left)){
				left = 0;
			}
			if(isNaN(top)){
				top = 0;
			}
			return {
				left : left,
				top : top
			}
		},
		//获取控件ID
		getWidgetId : function(){
			return this.$widget.attr("id");
		},
		/**
		 * 执行回调函数
		 * @param string key 回调函数名称
		 * @param array paramList 参数列表
		 */
		fireCallback : function(key, paramList){
			var callback = this.defaults.callback;
			if(typeof callback[key] == "function"){
				callback[key].apply(this, paramList);
			}
		},
		show : function(){
			this.$widget.show();
		},
		hide : function(){
			this.$widget.hide();
		},
		init : function(options){
			this.setOptions(options);
		},
		//销毁控件
		destroy : function(){
			this.$widget.remove();
			this.$widget = null;
			return null;
		}
	});
});
