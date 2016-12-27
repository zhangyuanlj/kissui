/*
  * 拖动层
  * author:张渊
  * modifyTime:2015-11-12
  *
  * @options hander 触发拖动的对象
  * @options dragObj 被拖动的对象
  * @options limitDrag 是否限制拖动
  * @options limitDragObj 限制拖动的对象
  * @options limitX 限制拖放区域横坐标
  * @options limitY 限制拖放区域纵坐标
  * @options lockX 是否水平锁定
  * @options lockY 是否垂直锁定
  *
  */
(function($){
	var KDrag = function(options){
		var that = this;
		var isTop = window == top;
		var $document = isTop ? $(document) : $(window.parent.document);
		var $window = isTop ? $(window) : $(window.parent);
		var $hander = null;
		var $dragObj = null;
		var $limitDragObj = null;
		var startDrag = false;
		var startX = 0;
		var startY = 0;
		var endX = 0;
		var endY = 0;
		var mouseX = 0;
		var mouseY = 0;
		//配置参数
		var _options = {  
			hander : $hander,     
			dragObj : $dragObj,   
			limitDrag : false,
			limitDragObj : $window,
			limitX : 0,
			limitY : 0,
			lockX : false,
			lockY : false        
		};
		this.init = function(){
			var func1 = arguments[0], func2 = arguments[1], func3 = arguments[2];
			$.extend(_options, options);
			$hander = _options.hander;
		    $dragObj = _options.dragObj;
			$limitDragObj = _options.limitDragObj;
			$hander.addClass("ks-dilog-title-move");
			this.bindStartDraggable(func1);
			this.bindDraggable(func2);
			this.bindEndDraggable(func3);
		}
		/**
		 * 绑定准备拖动事件
		 * @param function callback 触发拖动时执行的回调函数
		 */
		this.bindStartDraggable = function(callback){
			$hander.live("mousedown", function(e){
				_startDraggable(this, $dragObj, e);
				if(callback){
					callback();
				}
				return false;
			});
		}
		/**
		 * 绑定开始拖动事件
		 * @param function callback 拖动时执行的回调函数
		 */
		this.bindDraggable = function(callback){
			$document.mousemove(function(e){
				_draggable($dragObj, $limitDragObj, e, callback);
				//return false;
			});
		}
		/**
		 * 绑定结束拖动事件
		 * @param function callback 结束拖动时执行的回调函数
		 */
		this.bindEndDraggable = function(callback){
			$document.mouseup(function(e){
				_endDraggable(this, e, callback);
			});
			$(_options.hander).live("mouseup", function(e){
				_endDraggable(this, e, callback);
			});
		}
		/**
		 * 准备拖动
		 * @param object handerObj 触发拖动的对象
		 * @param object $dragObj 被拖动的对象
		 * @param object event 传入的事件对象
		 */
		function _startDraggable(handerObj, $dragObj, event){
			if(event.which != 1){
				return;
			}
			startDrag = true;
			startX = parseInt($dragObj.css("left"));
			startY = parseInt($dragObj.css("top"));
			mouseX = event.pageX - startX;
			mouseY = event.pageY - startY;
			//设置捕获范围
			if(handerObj.setCapture){
				handerObj.setCapture();
			}else if(window.captureEvents){
				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			}
			$dragObj.css("z-index", 99999);
			$(".ks-dilog").not($dragObj).css("z-index", 10000);
			_appendIframe($dragObj);
			event.stopPropagation();
		}
		/**
		 * 开始拖动
		 * @param object $dragObj 被拖动的对象
		 * @param object $limitDragObj 限制拖动的区域
		 * @param object event 传入的事件对象
		 * @param function callback 回调函数
		 */
		function _draggable($dragObj, $limitDragObj, event, callback){
			if(!startDrag){
				return;
			}
			var layer;
			endX = event.pageX - mouseX;
			endY = event.pageY - mouseY;
			if(_options.limitDrag){
				layer = that.limitDraggable(endX, endY, $dragObj, $limitDragObj);
				endX = layer.x;
				endY = layer.y;
			}
			else if(_options.lockX){
				layer = _draggableLockX(endX, startY, $dragObj, $limitDragObj);
				endX = layer.x;
				endY = layer.y;
			}
			else if(_options.lockY){
				layer = _draggableLockY(endY, startX, $dragObj, $limitDragObj);
				endX = layer.x;
				endY = layer.y;
			}
			$dragObj.css({
				left: endX, 
				top: endY
			});
			if(callback){
				callback();
			}
		}
		/**
		 * 结束拖动
		 * @param object handerObj 触发拖动的对象
		 * @param object event 传入的事件对象
		 * @param function callback 回调函数
		 */
		function _endDraggable(handerObj, event, callback){
			//取消捕获范围 
			if(handerObj.releaseCapture){ 
				handerObj.releaseCapture(); 
			}else if(window.captureEvents){ 
				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP); 
			} 
			startDrag = false;
			if(callback){
				callback();
			}
			_removeIframe($dragObj);
			event.stopPropagation();
		}
		/**
		  * _limitDraggable()：限制拖动
		  *
		  * return Object
		  * layer.x：对象横坐标
		  * layer.y：对象纵坐标
		  *
		  */
		 this.limitDraggable = function(endX, endY, $dragObj, $limitDragObj){
			var layer = {
				x : 0,
				y : 0
			};
			if(endX <= _options.limitX){
				endX = _options.limitX;
			}
			if(endY <= _options.limitY){
				endY = _options.limitY;
			}
			if(endX >= $limitDragObj.width() - $dragObj.outerWidth(true) - _options.limitX){
				endX = $limitDragObj.width() - $dragObj.outerWidth(true) - _options.limitX;
			}
			if(endY >= $limitDragObj.height() - $dragObj.outerHeight(true) - _options.limitY){
				endY = $limitDragObj.height() - $dragObj.outerHeight(true) - _options.limitY;
			}
			layer.x = endX;
			layer.y = endY;
			return layer;
		}
		/**
		 * 水平锁定
		 * @param integer endX 对象拖动时的横坐标
		 * @param integer startY 拖动对象的初始纵坐标
		 * @param object $dragObj 拖动对象
		 * @param object $limitDragObj 限制拖动的对象
		 */
		function _draggableLockX(endX, startY, $dragObj, $limitDragObj){
			var layer = {
				x : 0,
				y : 0
			};
			if(endX <= _options.limitX){
				endX = _options.limitX;
			}
			if(endX >= $limitDragObj.width() - $dragObj.outerWidth(true) - _options.limitX){
				endX = $limitDragObj.width() - $dragObj.outerWidth(true) - _options.limitX;
			}
			layer.x = endX;
			layer.y = startY;
			return layer;
		}
		/**
		 * 垂直锁定
		 * @param integer endY 对象拖动时的纵坐标
		 * @param integer startX 拖动对象的初始横坐标
		 * @param object $dragObj 拖动对象
		 * @param object $limitDragObj 限制拖动的对象
		 */
		function _draggableLockY(endY, startX, $dragObj, $limitDragObj){
			var layer = {
				x : 0,
				y : 0
			};
			if(endY <= _options.limitY){
				endY = _options.limitY;
			}
			if(endY >= $limitDragObj.height() - $dragObj.outerHeight(true) - _options.limitY){
				endY = $limitDragObj.height() - $dragObj.outerHeight(true) - _options.limitY;
			}
			layer.x = startX;
			layer.y = endY;
			return layer;
		}
		/**
		 * 检查对话框是否包含iframe框架
		 * @param object $dragObj 拖动对象
		 */
		function _checkDilogOwnIframe($dragObj){
			return $dragObj.children().find("iframe").length;
		}
		/**
		 * 添加遮罩层，修复存在iframe时的拖动BUG
		 * @param object $dragObj 拖动对象
		 */
		function _appendIframe($dragObj){
			var iframeLength = _checkDilogOwnIframe($dragObj);
			$dragObj.children(".drag-iframe-mask").remove();
			if(iframeLength){
				$dragObj.append("<div class=\"drag-iframe-mask\"></div>");
				$dragObj.children(".drag-iframe-mask").css({
					position : "absolute",
					width : $dragObj.width(),
					height : $dragObj.children(".ks-dilog-content").outerHeight(true),
					left : "0px",
					top : $dragObj.children(".ks-dilog-title").outerHeight(true),
					opacity : 0
				});
			}
		}
		/**
		 * 移除遮罩层
		 * @param object $dragObj 拖动对象
		 */
		function _removeIframe($dragObj){
			var iframeLength = _checkDilogOwnIframe($dragObj);
			if(iframeLength){
				$dragObj.children(".drag-iframe-mask").remove();
			}
		}
	};
	window.KDrag = KDrag;
})(jQuery);