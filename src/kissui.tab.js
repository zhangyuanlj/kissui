/**
  * JS选项卡
  * author:张渊
  * modifyTime:2015-12-15
  *
  */
Ks().package("K.Ui", function(Ks){
	this.Tab = function(config){
		this.$doc = $(document);
		this.config = {
			$tabTitle : $("#tabTitle"),
			$tabCon : $("#tabCon"),
			selectIndex : 0,   
			selectStyle : "active",   
            triggerEvent : "click", 
            slideEnabled : false,   
            slideInterval : 5000,   
            slideDelay : 300,       
            autoInit : true,        
            onShow:function(Tab, $selectTab, $selectCon){ 
				return true;
			}    
		};
		this._setConfig(config);
		this.selectIndex = this.config.selectIndex;
		if(this.config.autoInit){
			this.init();
		}
	};
	this.Tab.prototype = {
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
		//切换
		_slide : function(){
			var _config = this.config;
			var $tabTitle = _config.$tabTitle;
			var $tabCon = _config.$tabCon;
			var that = this;
			var intervalId = null,
				 delayId = null;
		    if(_config.slideEnabled){
				start();
			}
			//绑定事件
			this.$doc.off($tabTitle.selector).on(_config.triggerEvent, $tabTitle.selector, function(e){
				var $this = $(this);
				var selectIndex = $this.index();
				that.selectTab(selectIndex);
				clear();
				e.stopPropagation();
			});
			this.$doc.off($tabTitle.selector).on("mouseover", $tabTitle.selector, function(e){
				clear();
				e.stopPropagation();
			});
			this.$doc.off($tabTitle.selector).on("mouseout", $tabTitle.selector, function(e){
				delay();
				e.stopPropagation();
			});
			this.$doc.off($tabCon.selector).on("mouseover", $tabCon.selector, function(e){
				clear();
				e.stopPropagation();
			});
			this.$doc.off($tabCon.selector).on("mouseout", $tabCon.selector, function(e){
				delay();
				e.stopPropagation();
			});
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
			this.selectIndex--;
			if(this.selectIndex < 0){
				this.selectIndex = this.config.$tabTitle.length-1;
			}
			this.selectTab(this.selectIndex);
		},
		//向下切换
		_next : function(){
			this.selectIndex++;
			if(this.selectIndex > this.config.$tabTitle.length-1){
				this.selectIndex = 0;
			}
			this.selectTab(this.selectIndex);
		},
		init : function(){
			this.selectTab(this.config.selectIndex);
			this._slide();
		},
		/**
		 * 选中标签
		 * @param integer selectIndex 选中标签索引
		 */
		selectTab : function(selectIndex){
			var _config = this.config;
			var $tabTitle = _config.$tabTitle;
			var $tabCon = _config.$tabCon;
			var $selectTab = $tabTitle.eq(selectIndex); 
			var $selectCon = $tabCon.eq(selectIndex);
			var selectStyle = _config.selectStyle;
			this.selectIndex = selectIndex;
			$tabTitle.removeClass(selectStyle);
			$selectTab.addClass(selectStyle);
			if($tabCon.length > 1){
				$tabCon.hide();
				$selectCon.show();
			}
			else{
				$selectCon = $tabCon;
			}
			_config.onShow(this, $selectTab, $selectCon);
		},
		/**
		 * 添加标签
		 * @param object tab 包含标签标题和内容
		 */
		addTab : function(tab){
			var _config = this.config;
			_config.$tabTitle.parent().append(tab.tabTitle);
			_config.$tabCon.parent().append(tab.tabCon);
			_config.$tabTitle = $(_config.$tabTitle.selector);
			_config.$tabCon = $(_config.$tabCon.selector);
			this.selectTab(_config.$tabTitle.length-1);
		},
		/**
		 * 删除标签
		 * @param integer selectIndex 选中标签索引
		 */
		deleteTab : function(selectIndex){
			var _config = this.config;
			_config.$tabTitle.eq(selectIndex).remove();
			_config.$tabCon.eq(selectIndex).remove();
			_config.$tabTitle = $(_config.$tabTitle.selector);
			_config.$tabCon = $(_config.$tabCon.selector);
			this.selectTab(_config.$tabTitle.length-1);
		}
	};
});