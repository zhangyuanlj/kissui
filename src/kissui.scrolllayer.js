/*
 * JS无缝滚动
 * author:张渊
 * modifyTime:2015-11-13
 *
 * maskObj : "#mask",                                              //遮罩对象
 * scrollLayer : "#scroll_layer",                                  //滚动层
 * listLayer : "#img_layer",                                       //列表对象
 * autoplay : false,                                               //是否自动播放
 * direction : 1,                                                  //方向  1：水平；2：垂直；
 * speed : 900,                                                    //动画速度
 * scrollStep : 180,                                               //每次滚动多少像素
 * control : false,                                                //是否拥有控制按钮
 * prevBtn : "#prev_btn",                                          //上翻按钮
 * nextBtn : "#next_btn",                                          //下翻按钮
 * delay : 5000,                                                   //函数调用延迟
 * isMarquee : false                                               //是否模拟Marquee标签
 *
 */
(function($){
	var KScroll = function(options){
		var self = this;
		var timer = null;
		var isAnimate = false, isLoad = true;
		var scrollLeft = 0, scrollTop = 0;
		var _scrollDirection = "next";
		var _options = {
			maskObj : "#mask",
			scrollLayer : "#scroll_layer",
			listLayer : "#img_layer",
			autoplay : false,
			direction : 1,
			speed : 900,
			scrollStep : 180,
			control : false,
			prevBtn : "#prev_btn",
			prevBtnHoverStyle : "prev_btn_hover",
			nextBtn : "#next_btn",
			nextBtnHoverStyle : "next_btn_hover",
			delay : 3000,
			isMarquee : false
		};
		this.init = function(){
			$.extend(_options, options);
			_cloneScrollLayer();
			//模拟Marquee标签
			if(_options.isMarquee){
				_options.autoplay = true;
				_options.delay = 100;
			}
			if(_options.autoplay){
				this.setScrollDirection(_scrollDirection);
				this.setTimer();
			}
			_bindEvent();
		}
		/**
		 * 设置滚动方向
		 * @param string scrollDirection 滚动方向
		 */
		this.setScrollDirection = function(scrollDirection){
			_scrollDirection = scrollDirection;
		}
		//设置计时器
		this.setTimer = function(){
			timer = setInterval(_autoplay, _options.delay);
		}
		//清除计时器
		this.clearTimer = function(){
			clearInterval(timer);
			timer = null;
		}
		//将原列表复制一份添加到滚动层中
		function _cloneScrollLayer(){
			$(_options.scrollLayer).append($(_options.listLayer).clone());
		}
		//获取列表层的宽度
		function _getListLayerWidth(){
			return $(_options.listLayer).width();
		}
		//获取列表层的高度
		function _getListLayerHeight(){
			return $(_options.listLayer).height();
		}
		//检测水平向前滚动是否到达边界
		function _checkPrevHorizontalBoundary(left){
			if(left >= 0){
				return true;
			}
			return false;
		}
		//检测水平向后滚动是否到达边界
		function _checkNextHorizontalBoundary(left){
			if(left <= 0 - _getListLayerWidth()){
				return true;
			}
			return false;
		}
		//检测垂直向上滚动是否到达边界
		function _checkPrevVerticalBoundary(top){
			if(top >= 0){
				return true;
			}
			return false;
		}
		//检测垂直向下滚动是否到达边界
		function _checkNextVerticalBoundary(top){
			if(top <= 0 - _getListLayerHeight()){
				return true;
			}
			return false;
		}
		//水平滚动
		function _horizontalScroll(orientation){
			if(isAnimate || isLoad){
				return;
			}
			$(_options.scrollLayer).css("margin-left", scrollLeft);
			if(orientation == "prev"){
				if(_checkPrevHorizontalBoundary(scrollLeft)){
					  scrollLeft = 0 - _getListLayerWidth();
					  $(_options.scrollLayer).css("margin-left", scrollLeft);
				}
				scrollLeft += _options.scrollStep;
			}
			else{
				if(_checkNextHorizontalBoundary(scrollLeft)){
					  scrollLeft = 0;
					  $(_options.scrollLayer).css("margin-left", scrollLeft);
				}
				scrollLeft -= _options.scrollStep;
			}
			if(!_options.isMarquee){
				isAnimate = true;
				$(_options.scrollLayer).animate({"margin-left": scrollLeft}, _options.speed, function(){
					isAnimate = false;
				});
			}
			else{
				$(_options.scrollLayer).css("margin-left", scrollLeft);
			}
		}
		//垂直滚动
		function _verticalScroll(orientation){
			if(isAnimate || isLoad){
				return;
			}
			$(_options.scrollLayer).css("margin-top", scrollTop);
			if(orientation == "prev"){
				if(_checkPrevVerticalBoundary(scrollTop)){
					  scrollTop = 0 - _getListLayerHeight();
					  $(_options.scrollLayer).css("margin-top", scrollTop);
				}
				scrollTop += _options.scrollStep;
			}
			else{
				if(_checkNextVerticalBoundary(scrollTop)){
					  scrollTop = 0;
					  $(_options.scrollLayer).css("margin-top", scrollTop);
			   }
			   scrollTop -= _options.scrollStep;
			}
			if(!_options.isMarquee){
				isAnimate = true;
				$(_options.scrollLayer).animate({"margin-top": scrollTop}, _options.speed, function(){
					isAnimate = false;
				});
			}
			else{
				$(_options.scrollLayer).css("margin-top", scrollTop);
			}
		}
		//自动播放
		function _autoplay(){
			if(_options.direction == 1){
				_horizontalScroll(_scrollDirection);
			}
			else{
			   _verticalScroll(_scrollDirection); 
			}
			isLoad = false;
		}
		//绑定事件
		function _bindEvent(){
			$(_options.prevBtn).die().live("click", function(){
				  if(_options.isMarquee){
					 return false;
				  }
				  isLoad = false;
				  self.clearTimer();
				  if(_options.direction == 1){
					  _horizontalScroll("prev");
				  }
				  else{
					  _verticalScroll("prev"); 
				  }
			}).live("mouseover", function(){
				 $(this).addClass(_options.prevBtnHoverStyle);
				 self.clearTimer();
				 if(_options.isMarquee){
					  self.setScrollDirection("prev");
					  self.setTimer();
				 }
			}).live("mouseout", function(){
				$(this).removeClass(_options.prevBtnHoverStyle);
				if(_options.isMarquee){
					 return false;
				}
				if(_options.autoplay){
					self.setTimer();
				}
			});
			$(_options.nextBtn).die().live("click", function(){
				  if(_options.isMarquee){
					  return false;
				  }
				  isLoad = false;
				  self.clearTimer();
				  if(_options.direction == 1){
					  _horizontalScroll("next");
				  }
				  else{
					 _verticalScroll("next"); 
				  }
			}).live("mouseover", function(){
				 $(this).addClass(_options.nextBtnHoverStyle);
				 self.clearTimer();
				 if(_options.isMarquee){
					  self.setScrollDirection("next");
					  self.setTimer();
				 }
			}).live("mouseout", function(){
				$(this).removeClass(_options.nextBtnHoverStyle);
				if(_options.isMarquee){
					 return false;
				}
				if(_options.autoplay){
					self.setTimer();
				}
			});
			$(_options.maskObj).live("mouseover", function(){
				self.clearTimer();
			}).live("mouseout", function(){
				self.setTimer();
			});
		}
	};
	window.KScroll = KScroll;
})(window.jQuery || window.Zepto);