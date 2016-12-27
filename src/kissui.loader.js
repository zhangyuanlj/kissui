/*
 * 加载器
 * author:张渊
 * modifyTime:2016-10-12
 */
(function(top) {
	var KLoader = top.KLoader = function(config){
		var $loader = null;
		var that = this;
		var public = KLoader.prototype;
		var defaults = {
			speed : 200,
			loadText : "加载中，请稍后",
			callback : function(){
				return true;
			}
		};
		$.extend(true, defaults, config);
		var create = function(){
			var $body = $("body");
			var template = '<div id="loader" class="ks-loader">'
			             +      '<div class="ks-loader-bg"></div>'
						 +      '<div class="ks-loader-con">'
						 +      	'<div class="ks-loader-icon"></div>'
						 +      	'<div class="ks-loader-text"></div>'
						 + 		'</div>';
						 + '</div>';
			$body.append(template);
			$loader = $("#loader");
			$loader.children(".ks-loader-bg").css("opacity", 0.5);
			$loader.children().find(".ks-loader-text").text(defaults.loadText);
		};
		public.show = function(){
			var $doc = $(document);
			var docH = $doc.height();
			$loader.height(docH);
			if(defaults.speed){
				$loader.fadeIn(defaults.speed);
			}
			else{
				$loader.show()
			}
		};
		public.hide = function(){
			if(defaults.speed){
				$loader.fadeOut(defaults.speed, function(){
					defaults.callback();
				});
			}
			else{
				$loader.show();
				defaults.callback();
			}
		};
		public.init = function(){
			create();
		};
		public.destroy = function(){
			$loader.remove();
			$loader = null;
		};
	};
})(window);
