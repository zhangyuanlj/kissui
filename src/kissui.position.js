/*
 * 计算弹出层位置
 * author:张渊
 * modifyTime:2015-11-11
 */
(function($){
	var KPosition = function(config){
		this.config = {
			$targetObj : $("#target"),  
			$layer : $("#layer"),
			offsetPx : 0              
		};
		this._setConfig(config);
		this._init();
	};
	KPosition.prototype = {
		_init : function(){
			var $window = $(window);
			var _config = this.config;
			var $targetObj = _config.$targetObj;
			var $layer = _config.$layer;
			this.winWidth = $window.width();
			this.winHeight = $window.height();
			this.scrollLeft = $window.scrollLeft();
			this.scrollTop = $window.scrollTop();
			this.targetObjW = $targetObj.outerWidth(true);
			this.targetObjH = $targetObj.outerHeight(true);
			this.targetObjL = $targetObj.position().left;
			this.targetObjT = $targetObj.position().top;
			this.layerWidth = $layer.outerWidth(true);
			this.layerHeight = $layer.outerHeight(true);
		},
		/**
		 * 设置config
		 * @param Object config 配置项
		 */
		_setConfig : function(config){
			if(!config){
				return false;
			}
			$.extend(true, this.config, config);
		},
		/**
		 * 根据传入的位置，获取层的坐标
		 * @param String location
		 * "top-left", "top", "top-right"
		 * "right-top", "right", "right-bottom"
		 * "bottom-left", "bottom", "bottom-right"
		 * "left-top", "left", "left-bottom"
		 */
		getLayerPos : function(location){
			var $targetObj = this.config.$targetObj;
			var offsetPx = this.config.offsetPx;
			var cssPosition = $targetObj.css("position");
			var position = {
				left : 0,
				top : 0
			};
			switch(location){
				case "top-left" : position.left = this.targetObjL;
							 position.top = this.targetObjT-this.layerHeight-offsetPx;
							 break;
				case "top" : position.left = this.targetObjW>=this.layerWidth ? this.targetObjL+this.targetObjW/2-this.layerWidth/2 : this.targetObjL-this.layerWidth/2+this.targetObjW/2;
							 position.top = this.targetObjT-this.layerHeight-offsetPx;
							 break;
				case "top-right" : position.left = this.targetObjL+this.targetObjW-this.layerWidth;
							 position.top = this.targetObjT-this.layerHeight-offsetPx;
							 break;
				case "right-top" : position.left = this.targetObjL+this.targetObjW+offsetPx;
							 position.top = this.targetObjT;
							 break;
				case "right" : position.left = this.targetObjL+this.targetObjW+offsetPx;
							 position.top = this.targetObjH>=this.layerHeight ? this.targetObjT+this.targetObjH/2-this.layerHeight/2 : this.targetObjT-this.layerHeight/2+this.targetObjH/2;
							 break;
				case "right-bottom" : position.left = this.targetObjL+this.targetObjW+offsetPx;
							 position.top = this.targetObjT+this.targetObjH-this.layerHeight;
							 break;
				case "bottom-left" : position.left = this.targetObjL;
							 position.top = this.targetObjT+this.targetObjH+offsetPx;
							 break;
				case "bottom" : position.left = this.targetObjW>=this.layerWidth ? this.targetObjL+this.targetObjW/2-this.layerWidth/2 : this.targetObjL-this.layerWidth/2+this.targetObjW/2;
							 position.top = this.targetObjT+this.targetObjH+offsetPx;
							 break;
				case "bottom-right" : position.left = this.targetObjL+this.targetObjW-this.layerWidth;
							 position.top = this.targetObjT+this.targetObjH+offsetPx;
							 break;
				case "left-top" : position.left = this.targetObjL-this.layerWidth-offsetPx;
							 position.top = this.targetObjT;
							 break;
				case "left" : position.left = this.targetObjL-this.layerWidth-offsetPx;
							 position.top = this.targetObjH>=this.layerHeight ? this.targetObjT+this.targetObjH/2-this.layerHeight/2 : this.targetObjT-this.layerHeight/2+this.targetObjH/2;
							 break;
				case "left-bottom" : position.left = this.targetObjL-this.layerWidth-offsetPx;
							 position.top = this.targetObjT+this.targetObjH-this.layerHeight;
							 break;
				default : break;
			}
			if(cssPosition == "relative" || cssPosition == "absolute"){
				 position.left = position.left-this.targetObjL;
				 position.top = position.top-this.targetObjT;
			}
			return position;
		},
		/**
		 * 根据窗口水平或者垂直方向上剩余的空间动态更新层的位置
		 * @param Integer direction(1:水平 2:垂直)
		 */
		dynamicUpdate : function(direction){
			var _config = this.config;
			var $layer = _config.$layer;
			var location = "top";
			var position = {
				left : 0,
				top : 0
			};
			if(direction == 1){
				//右
				if(this.winWidth+this.scrollLeft-this.targetObjL-this.targetObjH >= this.layerWidth){
					location = "right";
				}
				//左
				else{
					location = "left";
				}
			}
			else if(direction == 2){
				//下
				if(this.winHeight+this.scrollTop-this.targetObjT-this.targetObjH >= this.layerHeight){
					location = "bottom";
				}
				//上
				else{
					location = "top";
				}
			}
			position = this.getLayerPos(location);
			$layer.css({
				left : position.left,
				top : position.top
			});
			return location;
		}
	};
	window.KPosition = KPosition;
})(jQuery);