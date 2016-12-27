/**
  * JS幻灯片
  * author:张渊
  * modifyTime:2015-12-15
  *
  */
(function($){
	var KSlideBox = function(config){
		this.config = {
			$item : $("#slideItem"),
			$title : null,
			$nav : $("#slideNav"),
			$prevBtn : null,                  
			$nextBtn : null,                  
			navSelect : "active",
			slideEnabled : true,   
            slideInterval : 5000,   
            slideDelay : 300,    
			slideType : 0,        
            onShow:function(KSlideBox){ 
				return true;
			}    
		};
		this.index = 0;          
		this._setConfig(config);
		this._init();
	};
	KSlideBox.prototype = {
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
		_init : function(){
			this._slide();
		},
		//切换
		_slide : function(){
			var _config = this.config;
			var $nav = _config.$nav;
			var $prevBtn = _config.$prevBtn;
			var $nextBtn = _config.$nextBtn;
			var that = this;
			var intervalId = null,
				 delayId = null;
		    if(_config.slideEnabled){
				start();
			}
			//绑定事件
			$nav.live("mouseover", function(){
				var $this = $(this);
				var index = $this.index();
				that._play(index);
				clear();
			}).live("mouseout", function(){
				delay();
			});
			if($prevBtn != null){
				$prevBtn.die().live("click", function(){
					_prev();
				}).live("mouseover", function(){
					clear();
				}).live("mouseout", function(){
					delay();
				});
			}
			if($nextBtn != null){
				$nextBtn.die().live("click", function(){
					_next();
				}).live("mouseover", function(){
					clear();
				}).live("mouseout", function(){
					delay();
				});
			}
			function start(){
				intervalId = setInterval(function(){
					that._next();
				}, _config.slideInterval);
			}
			function clear(){
				clearInterval(intervalId);
				clearTimeout(delayId);
			}
			function delay(){
				if(_config.slideEnabled){
					delayId = setTimeout(start, _config.slideDelay);
				}
			}
		},
		//向上切换
		_prev : function(){
			var itemLen = this._getItemLen();
			this.index--;
			if(this.index < 0){
				this.index = itemLen-1;
			}
			this._play(this.index);
		},
		//向下切换
		_next : function(){
			var itemLen = this._getItemLen();
			this.index++;
			if(this.index > itemLen-1){
				this.index = 0;
			}
			this._play(this.index);
		},
		_getItemLen : function(){
			return this.config.$item.length;
		},
		/**
		 * 切换动画
		 * @param integer index 当前索引
		 */
		_play : function(index){
			var _config = this.config;
			$item = _config.$item;
			$title = _config.$title;
			$nav = _config.$nav;
			this.index = index;
			if(_config.slideType){
				var speed = 300;
				$item.fadeOut(speed);
				$item.eq(index).fadeIn(300);
			}
			else{
				$item.hide();
				$item.eq(index).show();
			}
			$nav.removeClass(_config.navSelect);
			$nav.eq(index).addClass(_config.navSelect);
			if($title != null){
				$title.hide();
				$title.eq(index).show();
			}
			this.config.onShow(this);
		}
	};
	window.KSlideBox = KSlideBox;
})(jQuery);