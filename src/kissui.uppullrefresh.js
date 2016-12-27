/*
 * 上拉加载、下拉刷新
 * author:张渊
 * modifyTime:2016-9-8
 */
(function(top) {
	var KUpPullRefresh = top.KUpPullRefresh = function(config){
		var element = {
			$win : $(window),
			$doc : $(document)
		};
		var that = this;
		var public = KUpPullRefresh.prototype;
		var defualts = {
			up: {
				$upLoad : $("#pullUpLoad"),
				active : true,
				callback : function(UpPullRefresh){
					return true;
				}
			},
			pull: {
				$list : $("#list"),
				$pullLoad : $("#pullDownLoad"),
				active : true,
				maxDistan : 90,
				speed : 300,
				callback : function(UpPullRefresh){
					return true;
				}
			}
		};
		$.extend(true, defualts, config);
		var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
		var hasTouch = "ontouchstart" in window && !isTouchPad;
		var startTouchX = 0,
			endTouchX = 0,
			startTouchY = 0,
			endTouchY = 0;
		var isLock = false;
		var isCanDo = false;
		var scrollTop = element.$win.scrollTop();
		var touchMoveNum = 0;
		var maxDistan = 90;
		var upLoadHtml = defualts.up.$upLoad.html();
		var pullLoadHtml = defualts.pull.$pullLoad.html();
		//检测是否滚动到底部
		var isScrollBottom = function(scrollTop){
			var pullLoadH = defualts.pull.$pullLoad.height();
			var bottomValue = element.$doc.height()-element.$win.height()-pullLoadH;
			var isBottom = bottomValue > 0 ? scrollTop >= bottomValue : false;
			return isBottom;
		};
		var upFunc = function(){
			var scrollFunc = function($this){
				scrollTop = $this.scrollTop();
				resetPull(true);
				if(isScrollBottom(scrollTop)){
					that.unUpEvent();
					that.upLoadShow();
					defualts.up.callback(that);
				}
			};
			element.$win.on({
				scroll : function(){
					scrollFunc($(this));
				}
			});
		};
		//重置下拉刷新
		var resetPull = function(isScroll){
			isLock = false;
			isCanDo = false;
			startTouchX = 0;
			endTouchX = 0;
			startTouchY = 0;
			endTouchY = 0;
			that.setPullLoadHtml(pullLoadHtml);
			if(isScroll){
				defualts.pull.$pullLoad.css({
					opacity: 0,
					visibility: "hidden",
					"-webkit-transform": "translate3d(0,0,0)"
				});
			}
		};
		//下拉刷新回弹效果
		var pullBound = function(startTouchY, endTouchY){
			var moveDistan = Math.abs(endTouchY - startTouchY);
			if(moveDistan >= maxDistan){
				that.setPullLoadHtml("↑ 松开立即刷新");
				moveDistan = maxDistan;
			}
			else{
				that.setPullLoadHtml(pullLoadHtml);
			}
			defualts.pull.$pullLoad.css({
				"-webkit-transform": "translate3d(0," + moveDistan + "px, 0)"
			});
		};
		var startFunc = function(e){
			scrollTop = element.$win.scrollTop();
			if (scrollTop <= 0 && !isLock) {
				var even = typeof event == "undefined" ? e : event;
				isLock = true;
				isCanDo = true;
				startTouchX = hasTouch ? even.targetTouches[0].pageX : even.pageX;
				startTouchY = hasTouch ? even.targetTouches[0].pageY : even.pageY;
			}
		};
		var moveFunc = function(e){
			if (scrollTop <= 0 && isCanDo) {
				var even = typeof event == "undefined" ? e : event;
				endTouchX = hasTouch ? even.targetTouches[0].pageX : even.pageX;
				endTouchY = hasTouch ? even.targetTouches[0].pageY : even.pageY;
				if (startTouchY < endTouchY && endTouchX - startTouchX <= 30) {
					defualts.pull.$pullLoad.css({
						opacity: 1,
						visibility: "visible"
					});
					pullBound(startTouchY, endTouchY);
					even.preventDefault();
				}
				else{
					isLock = false;
				}
			}
		};
		var endFunc = function(e){
			if (isCanDo) {
				isCanDo = false;
				isLock = false;
				if(endTouchY-startTouchY >= maxDistan){
					that.unPullEvent();
					that.setPullLoadHtml("<i></i> 正在刷新");
					defualts.pull.callback(that);
				}
				else{
					that.pullLoadHide();
				}
			}
		};
		var pullFunc = function(){
			defualts.pull.$list.on({
				touchstart : function(e){
					startFunc(e);
				},
				touchmove : function(e){
					moveFunc(e);
				},
				touchend : function(e){
					endFunc(e);
				}
			});
		};
		//卸载下拉加载事件
		public.unUpEvent = function(){
			element.$win.off("scroll");
		};
		//卸载上拉加载事件
		public.unPullEvent = function(){
			defualts.pull.$list.off("touchstart");
			defualts.pull.$list.off("touchmove");
			defualts.pull.$list.off("touchend");
		}
		//重置组件
		public.reset = function(){
			if(defualts.up.active){
				upFunc();
			}
			if(defualts.pull.active){
				resetPull(false);
				pullFunc();
			}
		};
		public.upLoadShow = function(){
			defualts.up.$upLoad.css("visibility", "visible");
		};
		public.upLoadHide = function(){
			defualts.up.$upLoad.css("visibility", "hidden");
		};
		public.setUpLoadHtml = function(innerHtml){
			defualts.up.$upLoad.html(innerHtml);
		};
		public.setPullLoadHtml = function(innerHtml){
			defualts.pull.$pullLoad.html(innerHtml);
		};
		public.pullLoadHide = function(callback){
			defualts.pull.$pullLoad.animate({
				opacity: 0,
				translate3d: "0,0,0"
			}, defualts.pull.speed, function(){
				$(this).css("visibility", "hidden");
				if($.type(callback) == "function"){
					callback(that);
				}
			});
		};
		public.setPullList = function($list){
			defualts.pull.$list = $list;
		};
		public.init = function(){
			this.reset();
		};
	};
})(window);
