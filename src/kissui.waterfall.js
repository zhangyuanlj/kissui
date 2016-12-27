/*
* 瀑布流效果
* author:张渊
* modifyTime:2015-11-12
*
*/
(function($){
	var KWaterfall = function(options){
		var handler = null, that = this;
    	var page = 1;
   	    var isLoading = false;
		var defaults = {
			 requestUrl : "http://www.wookmark.com/api/json/popular",
			 autoResize: true, 
     		 container: "#tiles",
			 loadingObj : "#loaderCircle",
     		 offset: 2, 
      		 itemWidth: 210 
		};
		_init();
		function _init(){
			$.extend(defaults, options);
			_bindEvent();
		}
		//判断是否滚动到浏览器底部
		function _onScroll() {
		  if(!isLoading) {
			var closeToBottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 100);
			if(closeToBottom) {
			  that.loadData();
			}
		  }
		};
		function _applyLayout() {
		  if(handler){ 
		  	handler.wookmarkClear();
		  }
		  handler = $(defaults.container + " li");
		  handler.wookmark({
			  autoResize: defaults.autoResize,
			  container: $(defaults.container), 
			  offset: defaults.offset, 
			  itemWidth: defaults.itemWidth 
		  });
		};
		//加载数据
		this.loadData = function() {
		  $.ajax({
				url: defaults.requestUrl,
				dataType: 'jsonp',
				data: "page=" + page, 
				beforeSend: function(){
					isLoading = true;
		  			$(defaults.loadingObj).show();
				},
				success: function(data){
					_onLoadData(data);
				}
		  });
		};
		function _onLoadData(data) {
		  isLoading = false;
		  $(defaults.loadingObj).hide();
		  page++;
		  var html = "";
		  var i = 0, length = data.length, image;
		  for(; i < length; i++) {
			image = data[i];
			html += "<li>";
			html += "<img src=\"" + image.preview + "\" width=\"" + (defaults.itemWidth - 10) 
			     + "\" height=\"" + Math.round(image.height / image.width * (defaults.itemWidth - 10)) + "\" title=\"" + image.title + "\" />";
			html += "<p>" + image.title + "</p>";
			html += "</li>";
		  }
		  $(defaults.container).append(html);
		  _applyLayout();
		};
	    function _bindEvent(){
			$(window).bind("scroll", _onScroll);
		}
	};
	window.KWaterfall = KWaterfall;
})(jQuery);