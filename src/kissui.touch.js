/*
 * 移动端组件
 * author:张渊
 * modifyTime:2016-12-20
 */
Ks().package("K.Ui", function(Ks){
	var Touch = Ks.creatClass(K.Ui.Widget, {
		defaults : {
			$mask : $(".ks-mask"),
			$ajaxLoading : $(".ks-ajax-loading"),
			toast : {
				$el : $(".ks-toast"),
				pos : "center",
				showTime : 3000
			}
		},
		/**
		 * 遮罩层
		 *
		 * @param string funcName 调用函数名称
		 * @param function callback 回调函数
		 *
		 */
    	mask : function(funcName, callback){
    		var $mask = this.defaults.$mask;
    		var self = this;
    		var func = {
    			show : function(){
    				var viewSize = self.getViewSize();
					$mask.css({
						width : viewSize.docW,
						height : viewSize.winH < viewSize.docH ? viewSize.docH : viewSize.winH
					}).show();
    			},
    			hide : function(){
    				$mask.hide();
    			},
    			display : function(){
    				if($mask.css("display") == "block"){
    					return true;
    				}
    				else{
    					return false;
    				}
    			},
    			addEvent : function(){
    				if(typeof callback == "function"){
    					$mask.off().on("mousedown", function(e){
    						callback();
    						e.stopPropagation();
    					});
    				}
    			}
    		};
    		return func[funcName]();
    	},
    	/**
		 * 数据加载提示
		 *
		 * @param string funcName 调用函数名称
		 * @param string loadText 显示文本
		 *
		 */
    	ajaxLoading : function(funcName, loadText){
    		var $ajaxLoading = this.defaults.$ajaxLoading;
    		var text = loadText === undefined ? "正在加载..." : loadText;
    		var func = {
    			show : function(){
    				$ajaxLoading.find("span").html(text);
    				$ajaxLoading.show();
    			},
    			hide : function(){
    				$ajaxLoading.hide();
    			},
    			display : function(){
    				if($ajaxLoading.css("display") == "block"){
    					return true;
    				}
    				else{
    					return false;
    				}
    			}
    		};
    		return func[funcName]();
    	},
    	/**
		 * 提示信息
		 *
		 * @param string content 显示文本
		 * @param function callback 回调函数
		 *
		 */
		toast : function(content, callback){
			var toastOpt = this.defaults.toast;
			var $toast = toastOpt.$el;
			var self = this;
			var viewSize = self.getViewSize();
			var pos = toastOpt.pos;
			$toast.find("p").text(content);
			var left = viewSize.winW/2 - $toast.width()/2;
			var top = 10;
			if(pos == "center"){
				top = viewSize.winH/2 - $toast.height()/2;
			}
			else if(pos == "bottom"){
				top = viewSize.winH - $toast.height() - 10;
			}
			$toast.css({
				left : left,
				top : top,
				visibility : "visible"
			});
			K.Utils.delayFunc(function(){
				$toast.removeAttr("style").css("visibility", "hidden");
				if($.isFunction(callback)){
					callback();
				}
			}, toastOpt.showTime);
		},
		/**
		 * 初始化单选按钮
		 *
		 * @param object $radio 单选按钮
		 * @param function callback 回调函数
		 *
		 */
		renderRadio : function($radio, callback){
			var arguLen = arguments.length;
			var $radio = arguments[0];
			var callback = arguments[arguLen-1];
			var selected = "checked";
			$radio.off().on("mousedown", function(e) {
				var $this = $(this);
				$radio.removeClass(selected);
				$this.addClass(selected);
				if(typeof callback == "function"){
					callback();
				}
				e.stopPropagation();
			});
		},
		/**
		 * 获取选中单选按钮的值
		 *
		 * @param string selector 选择器
		 * @return string 选中单选按钮的值
		 *
		 */
		getRadioValue : function(selector){
			return $(selector+" a[class*='checked']").attr("data-value");
		},
		/**
		 * 初始化复选框
		 *
		 * @param object $checkbox 复选框
		 * @param function callback 回调函数
		 *
		 */
		renderCheckbox : function($checkbox, callback){
			var arguLen = arguments.length;
			var $checkbox = arguments[0];
			var callback = arguments[arguLen-1];
			var selected = "checked";
			$checkbox.off().on("mousedown", function(e) {
				var $this = $(this);
				if(!$this.hasClass(selected)){
					$this.addClass(selected);
				}
				else{
					$this.removeClass(selected);
				}
				if(typeof callback == "function"){
					callback();
				}
				e.stopPropagation();
			});
		},
		/**
		 * 获取选中复选框的值
		 *
		 * @param object $checkbox 复选框
		 * @return array 选中复选框的值
		 *
		 */
		getCheckboxValue : function($checkbox){
			var returnValue = [];
			var selected = "checked";
			$checkbox.each(function(){
				var $this = $(this);
				if($this.hasClass(selected)){
					var thisValue = $this.attr("data-value");
					returnValue.push(thisValue);
					return true;
				}
			});
			return returnValue;
		},
		/**
		 * 初始化开关
		 *
		 * @param object $switch 开关
		 * @param function callback 回调函数
		 *
		 */
		renderSwitch : function($switch, callback){
			var arguLen = arguments.length;
			var $switch = arguments[0];
			var callback = arguments[arguLen-1];
			var selected = "checked";
			$switch.off().on("mousedown", function(e) {
				var $this = $(this);
				if(!$this.hasClass(selected)){
					$this.addClass(selected);
				}
				else{
					$this.removeClass(selected);
				}
				if(typeof callback == "function"){
					callback();
				}
				e.stopPropagation();
			});
		},
		/**
		 * 获取打开开关的值
		 *
		 * @param string selector 选择器
		 * @return object 打开开关的值
		 *
		 */
		getSwitchValue : function($switch){
			var returnValue = {};
			var selected = "checked";
			$switch.each(function(){
				var $this = $(this);
				if($this.hasClass(selected)){
					var thisName = $this.attr("name");
					var thisValue = $this.attr("data-value");
					returnValue[thisName] = thisValue;
					return true;
				}
			});
			return returnValue;
		},
		init : function(options){
			this.callSuper(options);
		}
	});
	this.Touch = (function(){
		var options = {};
		if(CONFIG){
			var widgetConfig = CONFIG.widget;
			options = {
				$mask : $("."+widgetConfig.mask.styleName),
				$ajaxLoading : $("."+widgetConfig.ajaxLoading.styleName),
				toast : {
					$el : $("."+widgetConfig.toast.styleName),
					pos : widgetConfig.toast.pos,
					showTime : widgetConfig.toast.showTime
				}
			};
		}
		return new Touch(options);
	})();
});