/*
  * 放大镜效果
  * author:张渊
  * modifyTime:2015-11-12
  *
  * @options thumbImgObj 缩略图
  * @options parent 父容器
  * @options zoomBoxStyle 放大镜容器的样式名称
  * @options zoomBoxDirection 放大镜容器显示位置(1：水平 2：垂直)
  *
  */
(function($){
	var KZoom = function(options){
		var thumbImgMouseX = 0, thumbImgMouseY = 0;
		var zoomboxWidth = 500, zoomboxHeight = 500;
		var imgaesLoad = false;
		var _options = {
			thumbImgObj : "#thumb_img",
			parent : "body",
			zoomBoxStyle : "zoombox",
			loadingImg : "img/loader.gif",
			zoomBoxDirection : 1
		};
		this.init = function(){
			$.extend(_options, options);
			_bindEvent();
		}
		/**
		 * 创建大图容器
		 * @param object eventObj 缩略图对象
		 */
		function _createZoomBox(eventObj){
			var zoomHtml = "<div class=\"" + _options.zoomBoxStyle + "\" id=\"zoombox\"></div>";
			var zIndex = K.Tool.getzIndex();
			$(_options.parent).append(zoomHtml);
			$("#zoombox").css({
				position : "absolute",
				"z-index" : zIndex,
				width : zoomboxWidth,
				height : zoomboxHeight,
				"background-image" : "url(" + _options.loadingImg + ")",
				"background-repeat" : "no-repeat",
				"background-position" : "center",
				overflow : "hidden"
			});
			var Position = new KPosition({
				$targetObj : $(eventObj),  
				$layer : $("#zoombox"),
				offsetPx : 10     
			});
			Position.dynamicUpdate(_options.zoomBoxDirection);
		}
		/**
		 * 像大图容器添加图片
		 * @param string imagesUrl 图片地址
		 */
		function _appendImages(imagesUrl){
			$("#zoombox").append("<img src=\"" + imagesUrl + "\" />");
			$("#zoombox img").css("position" , "absolute").hide();
		}
		/**
		 * 移动容器内图片
		 * @param integer thumbImgMouseX 鼠标相对于缩略图横坐标
		 * @param integer thumbImgMouseY 鼠标相对于缩略图纵坐标
		 */
		function _moveImages(thumbImgObj, bigImgObj, thumbImgMouseX, thumbImgMouseY){
			var thumbImgWidth = $(thumbImgObj).width();
			var thumbImgHeight = $(thumbImgObj).height();
			var bigImgWidth = $(bigImgObj).width();
			var bigImgHeight = $(bigImgObj).height();
			var bigImgMouseX = 0 - thumbImgMouseX / thumbImgWidth * (bigImgWidth - zoomboxWidth);
			var bigImgMouseY = 0 - thumbImgMouseY / thumbImgHeight * (bigImgHeight - zoomboxHeight);
			$("#zoombox img").css({
				left : bigImgMouseX,
				top : bigImgMouseY
			});
		}
		function _bindEvent(){
			$(_options.thumbImgObj).live("mouseover", function(e){
				var self = this;
				_createZoomBox(this);
				_appendImages($(this).attr("bigImgUrl"));
				$("#zoombox img").load(function(){
					imgaesLoad = true;
					$(this).show();
					thumbImgMouseX = e.pageX - $(self).offset().left;
					thumbImgMouseY = e.pageY - $(self).offset().top;
					_moveImages(self, "#zoombox img", thumbImgMouseX, thumbImgMouseY);
				});
			}).live("mousemove", function(e){
				if(!imgaesLoad){
					return false;
				}
				thumbImgMouseX = e.pageX - $(this).offset().left;
				thumbImgMouseY = e.pageY - $(this).offset().top;
				_moveImages(this, "#zoombox img", thumbImgMouseX, thumbImgMouseY);
			}).live("mouseout", function(){
				$("#zoombox").remove();
			});
		}
	};
	window.KZoom = KZoom;
})(jQuery);