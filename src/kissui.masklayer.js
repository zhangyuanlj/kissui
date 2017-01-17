/*
 * 遮罩层
 * author:张渊
 * modifyTime:2015-12-15
 */
Ks().package("K.Ui", function(Ks){
	this.Mask = function(config){
		this.$mask = null;
		this.config = {
			backGround : "#000",
			opacity : 0.3,
			zIndex : 10000,
			onMaskLayerClick : function(Mask){
				return true;
			}
		};
		this._setConfig(config);
		this._zIndex = this.config.zIndex;
		this._init();
	};
	this.Mask.prototype = {
		_init : function(){
			var that = this;
			var isTop = window == top;
			var $document = isTop ? $(document) : $(window.parent.document);
			var $window = isTop ? $(window) : $(window.parent);
			var $body = isTop ? $("body") : $("body", window.parent.document);
			var maskHeight = $window.height() < $document.height() ? $document.height() : $window.height();
			var _config = this.config;
			var date = new Date();
			var maskId = "mask-" + date.getTime();
			$body.append("<div id=\""+maskId+"\" class=\"ks-mask\"></div>");
			this._isShow = true;
			this.$mask = isTop ? $("#"+maskId) : $("#"+maskId, window.parent.document);
			this.$mask.height(maskHeight);
			this.reset();
			this.$mask.off().on("click", function(){
				_config.onMaskLayerClick(that);
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
		/**
		 * 设置透明度
		 * @param float opacity 透明度,0~1之间的小数
		 */
		setOpacity : function(opacity){
			this.$mask.css("opacity", opacity);
		},
        //获取遮罩的层级
        getZIndex : function(){
            return this._zIndex;
        },
        //设置遮罩的层级
        setZIndex : function(zIndex){
			this.$mask.css("z-index", zIndex);
            this._zIndex = zIndex;
        },
		//显示
		show : function(){
			this._isShow = true;
			this.$mask.show();
		},
		//隐藏
		hide : function(){
			this._isShow = false;
			this.$mask.hide();
		},
		/**
		 * 淡入
		 * @param integer speed 速度
		 * @param function callback 回调函数
		 */
		fadeIn : function(speed, callback){
			this._isShow = true;
			this.setOpacity(0);
			this.$mask.fadeTo(speed, this.config.opacity, function(){
				if(typeof callback == "function"){
					callback();
				}
			});
		},
		/**
		 * 淡出
		 * @param integer speed 速度
		 * @param function callback 回调函数
		 */
		fadeOut : function(speed, callback){
			this._isShow = false;
			this.$mask.fadeOut(speed, function(){
				if(typeof callback == "function"){
					callback();
				}
			});
		},
        //指示遮罩是否显示中
        isShow : function(){
            return this._isShow;
        },
        //切换遮罩的显示隐藏
        toggleShow : function(){
            if(this.isShow()){
                this.hide();
            }else{
                this.show();
            }
        },
		reset : function(){
			this.setOpacity(this.config.opacity);
			this.setZIndex(this.config.zIndex);
			return this;
		},
		//移除遮罩层
		remove : function(){
			this.$mask.off("click");
			this.$mask.remove();
			return null;
		}
	};
});