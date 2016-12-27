/*
 * JS层滚动
 * author:张渊
 * modifyTime:2015-11-13
 *
 * scrollLayer : "#scroll_layer"                                  //滚动层
 * listLayer : "#img_layer"                                       //列表对象
 * everyScreenLength : 4                                          //每一屏显示多少个列表
 * direction : 1                                                  //方向  1：水平；2：垂直；
 * speed : 900                                                    //动画速度
 * prevBtn : "#prev_btn"                                          //上翻按钮
 * nextBtn : "#next_btn"                                          //下翻按钮
 * itemsSelectStyle : "current"                                   //列表选中样式
 * btnDisableStyle : "disable"                                    //按钮禁用样式
 * itemsClickCallback : function(){                               //给选中的items附加一个回调函数
		return false;
	}
 *
 *
 */
(function($){
	var KRollLayer = function(options){
		var self = this;
		var isAnimate = false;
		var scrollLeft = 0, scrollTop = 0;
		var maskObjWidth = 0, maskObjHeight = 0, scrollLayerWidth = 0, scrollLayerHeight = 0;
		var scrollStep = 0;
		var listLayerLength;
		var _options = {
			scrollLayer : "#scroll_layer",
			listLayer : "#img_layer",
			everyScreenLength : 4,
			direction : 1,
			speed : 900,
			prevBtn : "#prev_btn",                                       
			nextBtn : "#next_btn",
			itemsSelectStyle : "current",
			btnDisableStyle : "disable",
			itemsClickCallback : function(itemsIndex){
				return false;
			}
		}
		this.init = function(){
			$.extend(_options, options);
			listLayerLength = $(_options.listLayer).length;
			if(_options.direction === 1){
				_horScroll();	
				this.setHorSelectItems(0);
			}
			else{
				_verScroll();
				this.setVerSelectItems(0);
			}
			$(_options.prevBtn).addClass(_options.btnDisableStyle);
			_bindEvent();
		}
		function _horScroll(){
			maskObjWidth = _getMaskObjWidth();
			scrollLayerWidth = _getScrollLayerWidth();
		}
		function _verScroll(){
			maskObjHeight = _getMaskObjHeight();
			scrollLayerHeight = _getScrollLayerHeight();
		}
		//获取遮罩层宽度
		function _getMaskObjWidth(){
			return $(_options.listLayer).outerWidth(true) * _options.everyScreenLength;
		}
		//获取遮罩层高度
		function _getMaskObjHeight(){
			return $(_options.listLayer).outerHeight(true) * _options.everyScreenLength;
		}
		//获取滚动层宽度
		function _getScrollLayerWidth(){
			return $(_options.listLayer).outerWidth(true) * listLayerLength;
		}
		//获取滚动层高度
		function _getScrollLayerHeight(){
			return $(_options.listLayer).outerHeight(true) * listLayerLength;
		}
		/**
		 * 动态获取水平滚动步长
		 * @param string orientation 水平滚动方向
		 */
		function _dynamicGetHorScrollStep(orientation){
			var left = 0 - parseInt($(_options.scrollLayer).css("margin-left"));
			scrollStep = maskObjWidth;
			if(orientation == "prev"){
				if(left % maskObjWidth != 0 && Math.floor(left / maskObjWidth) <= 1){
					scrollStep = left;
				}
			}
			else{
				if((scrollLayerWidth - left) % maskObjWidth != 0 && Math.floor((scrollLayerWidth - left) / maskObjWidth) <= 1){
					scrollStep = scrollLayerWidth - left - scrollStep;
				}
			}
		}
		/**
		 * 动态获取垂直滚动步长
		 * @param string orientation 垂直滚动方向
		 */
		function _dynamicGetVerScrollStep(orientation){
			var top = 0 - parseInt($(_options.scrollLayer).css("margin-top"));
			scrollStep = maskObjHeight;
			if(orientation == "prev"){
				if(top % maskObjHeight != 0 && Math.floor(top / maskObjHeight) <= 1){
					scrollStep = top;
				}
			}
			else{
				if((scrollLayerHeight - top) % maskObjHeight != 0 && Math.floor((scrollLayerHeight - top) / maskObjHeight) <= 1){
					scrollStep = scrollLayerHeight - top - scrollStep;
				}
			}
		}
		//检测水平向上滚动
		function _checkHorPrevScroll(){
			if(!scrollLeft){
				return false;
			}
			return true;
		}
		//检测水平向下滚动
		function _checkHorNextScroll(){
			if(scrollLeft <= 0 - (scrollLayerWidth - maskObjWidth)){
				return false;
			}
			return true;
		}
		//检测垂直向上滚动
		function _checkVerPrevScroll(){
			if(!scrollTop){
				return false;
			}
			return true;
		}
		//检测垂直向下滚动
		function _checkVerNextScroll(){
			if(scrollTop <= 0 - (scrollLayerHeight - maskObjHeight)){
				return false;
			}
			return true;
		}
		/**
		 * 水平滚动
		 * @param string orientation 水平滚动方向
		 */
		function _horScrollPlay(orientation){
			if(isAnimate){
				return;
			}
			_dynamicGetHorScrollStep(orientation);
			if(orientation == "prev"){
				scrollLeft += scrollStep;
			}
			else{
				scrollLeft -= scrollStep;
			}
			isAnimate = true;
			$(_options.scrollLayer).animate({"margin-left" : scrollLeft}, _options.speed, function(){
				isAnimate = false;
				_btnStyle();
			});
		}
		/**
		 * 垂直滚动
		 * @param string orientation 垂直滚动方向
		 */
		function _verScrollPlay(orientation){
			if(isAnimate){
				return;
			}
			_dynamicGetVerScrollStep(orientation);
			if(orientation == "prev"){
				scrollTop += scrollStep;
			}
			else{
				scrollTop -= scrollStep;
			}
			isAnimate = true;
			$(_options.scrollLayer).animate({"margin-top" : scrollTop}, _options.speed, function(){
				isAnimate = false;
				_btnStyle();
			});
		}
		//上翻、下翻按钮样式
		function _btnStyle(){
			if(_checkHorPrevScroll() || _checkVerPrevScroll()){
				$(_options.prevBtn).removeClass(_options.btnDisableStyle);
			}
			else{
				$(_options.prevBtn).addClass(_options.btnDisableStyle);
			}
			if(_checkHorNextScroll() || _checkVerNextScroll()){
				$(_options.nextBtn).removeClass(_options.btnDisableStyle);
			}
			else{
				$(_options.nextBtn).addClass(_options.btnDisableStyle);
			}
		}
		/**
		 * 设置水平滚动选中的items
		 * @param integer currentIndex 选中items的索引
		 */
		this.setHorSelectItems = function(currentIndex){
			$(_options.listLayer).eq(currentIndex).addClass(_options.itemsSelectStyle);
			$(_options.listLayer).not($(_options.listLayer).eq(currentIndex)).removeClass(_options.itemsSelectStyle);
			if(listLayerLength <= _options.everyScreenLength){
				return false;
			}
			if(currentIndex <= Math.floor(_options.everyScreenLength / 2)){
				scrollLeft = 0;
			}
			else if(currentIndex >= listLayerLength - _options.everyScreenLength + Math.floor(_options.everyScreenLength / 2)){
				scrollLeft = 0 - (listLayerLength - _options.everyScreenLength) * $(_options.listLayer).outerWidth(true);
			}
			else{
				scrollLeft =  0 - (currentIndex - Math.floor(_options.everyScreenLength / 2)) * $(_options.listLayer).outerWidth(true);
			}
			$(_options.scrollLayer).stop().animate({"margin-left" : scrollLeft}, _options.speed, function(){
				_btnStyle();
			});
		}
		/**
		 * 设置垂直滚动选中的items
		 * @param integer currentIndex 选中items的索引
		 */
		this.setVerSelectItems = function(currentIndex){
			$(_options.listLayer).eq(currentIndex).addClass(_options.itemsSelectStyle);
			$(_options.listLayer).not($(_options.listLayer).eq(currentIndex)).removeClass(_options.itemsSelectStyle);
			if(listLayerLength <= _options.everyScreenLength){
				return false;
			}
			if(currentIndex <= Math.floor(_options.everyScreenLength / 2)){
				scrollTop = 0;
			}
			else if(currentIndex >= listLayerLength - _options.everyScreenLength + Math.floor(_options.everyScreenLength / 2) && currentIndex >= _options.everyScreenLength){
				scrollTop = 0 - (listLayerLength - _options.everyScreenLength) * $(_options.listLayer).outerHeight(true);
			}
			else{
				scrollTop =  0 - (currentIndex - Math.floor(_options.everyScreenLength / 2)) * $(_options.listLayer).outerHeight(true);
			}
			$(_options.scrollLayer).stop().animate({"margin-top" : scrollTop}, _options.speed, function(){
				_btnStyle();
			});
		}
		function _bindEvent(){
			$(_options.prevBtn).die().live("click", function(){
				if(_options.direction === 1){
					if(!_checkHorPrevScroll()){
						return false;
					}
					_horScrollPlay("prev");
				}
				else{
					if(!_checkVerPrevScroll()){
						return false;
					}
					_verScrollPlay("prev");
				}
			});
			$(_options.nextBtn).die().live("click", function(){
				if(_options.direction === 1){
					if(!_checkHorNextScroll()){
						return false;
					}
					_horScrollPlay("next");
				}
				else{
					if(!_checkVerNextScroll()){
						return false;
					}
					_verScrollPlay("next");
				}
			});
			$(_options.listLayer).die().live("click", function(){
				var itemsIndex = $(this).index();
				if(_options.direction === 1){
					self.setHorSelectItems(itemsIndex);
				}
				else{
					self.setVerSelectItems(itemsIndex);
				}
				_options.itemsClickCallback(itemsIndex);
			});
		}
	};
	window.KRollLayer = KRollLayer;
})(jQuery);