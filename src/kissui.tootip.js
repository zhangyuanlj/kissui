/*
 * 气泡提示
 * author:张渊
 * modifyTime:2015-11-12
 */
Ks().package("K.Ui", function(Ks){
	this.Tootip = function(config){
		this.$tootip = null;
		this.config = {
			$eventObj : $("#show-tootip"),
			width : 200,
			content : "这里是气泡提示的内容",
			location : "top",
			dynamic : {
				enable : false,
				direction : 1
			},
			animate : false,
			offsetPx : 0
		};
		this._setConfig(config);
		this._init();
	};
	this.Tootip.prototype = {
		_init : function(){
			var that = this;
			var _config = this.config;
			var date = new Date();
			var tooltipId = "tooltip-" + date.getTime();
			var tooltipTemp = '<div id="'+tooltipId+'" class="ks-tooltip ks-tooltip-'+_config.location+'">'
            				+     '<i class="ks-tooltip-arrow"></i>'
            				+     '<div class="ks-tooltip-content">'+_config.content+'</div>'
        					+  '</div>';
			_config.$eventObj.append(tooltipTemp);
			this.$tootip = $("#"+tooltipId);
			this.$tootip.width(_config.width);
			this.$tootip.hide();
			var Position = new K.Ui.Position({
				$targetObj : _config.$eventObj,  
				$layer : this.$tootip,
				offsetPx : _config.offsetPx        
			});
			if(_config.dynamic.enable){
				this._dynamicUpdate(Position, _config.dynamic.direction);
			}
			else{
				this._setPosition(Position, _config.location);
			}
			_config.$eventObj.on("mouseover", function(){
				that._show();
			}).on("mouseout", function(){
				that._hide();
			});
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
		_show : function(){
			var animate = this.config.animate;
			if(animate){
				this.$tootip.hide().fadeIn("fast");
			}
			else{
				this.$tootip.show();
			}
		},
		_hide : function(){
			this.$tootip.hide();
		},
		/**
		 * 动态更新气泡位置
		 * @param Object Position 位置对象
		 * @param Integer direction(1:水平 2:垂直)
		 */
		_dynamicUpdate : function(Position, direction){
			var location = Position.dynamicUpdate(direction);
			this.$tootip.attr("class", "ks-tooltip ks-tooltip-"+location);
		},
		/**
		 * 设置气泡位置
		 * @param Object Position 位置对象
		 * @param String location 气泡位置
		 */
		_setPosition : function(Position, location){
			var position = Position.getLayerPos(location);
			this.$tootip.css({
				left : position.left,
				top : position.top
			});
		},
		//获取tooltip的ID
		getTooltipId : function(){
			return this.$tootip.attr("id");
		},
		//销毁tooltip控件
		destroy : function(){
			this.$tootip.remove();
			return null;
		}
	};
});