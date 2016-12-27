/*
 * 下拉列表
 * author:张渊
 * modifyTime:2015-11-13
 */
(function($){
	var KDropDown = function(config){
		this.config = {
			$targetObj : $("#target"),  
			$layer : $("#dropdown-list"),
			layerWidth : 240,
			location : "top",
			show : false,
			triggerMode : "mouseover"            
		};
		this._setConfig(config);
		if(this.config.location == "left" || this.config.location == "right"){
			alert("位置参数只能为top和bottom！！！");
			return false;
		}
		this._init();
	};
	KDropDown.prototype = {
		_init : function(){
			var that = this;
			var _config = this.config;
			var $layer = _config.$layer;
			$layer.width(_config.layerWidth);
			var Position = new KPosition({
				$targetObj : _config.$targetObj,  
				$layer : _config.$layer,
				offsetPx : 0       
			});
			var layerPos = Position.getLayerPos(_config.location);
			$layer.css({
				left : layerPos.left,
				top : layerPos.top
			});
			if(_config.show){
				this.layerShow();
			}
			else{
				that.layerHide();
				if(_config.triggerMode == "mouseover"){
					_config.$targetObj.live("mouseover", function(){
						that.layerShow();
					}).live("mouseout", function(){
						that.layerHide();
					});
				}
				else if(_config.triggerMode == "mousedown"){
					_config.$targetObj.live("mousedown", function(e){
						if(e.which != 1){
							return false;
						}
						var display = $layer.css("display");
						if(display == "none"){
							$(".ks-popLayer").hide();
							$(".ks-dropdown").hide();
							that.layerShow();
						}
						else{
							that.layerHide();
						}
						e.stopPropagation();
					});
					$(document).bind("mousedown", function(){
						var $popLayer = $(".ks-popLayer");
						var $dropDown = $(".ks-dropdown");
						if($popLayer.length){
							$popLayer.hide();
						}
						if($dropDown.length){
							$dropDown.hide();
						}
					});
				}
			}
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
		layerShow : function(){
			this.config.$layer.show();
		},
		layerHide : function(){
			this.config.$layer.hide();
		}
	};
	window.KDropDown = KDropDown;
})(jQuery);