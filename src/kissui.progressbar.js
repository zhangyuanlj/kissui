/*
 * 进度条
 * author:张渊
 * modifyTime:2016-10-11
 */
Ks().package("K.Ui", function(Ks){
	this.ProgressBar = function(config){
		var $progressBar = null;
		var that = this;
		var public = K.Ui.ProgressBar.prototype;
		var defaults = {
			speed : 5000,
			callback : function(){
				return true;
			}
		};
		var loadTimer = null;
		var aniSpeed = 900;
		$.extend(true, defaults, config);
		defaults.speed = defaults.speed < 1000 ? 1000 : defaults.speed; 
		var create = function(){
			var $body = $("body");
			var template = '<div id="progressBar" class="ks-progress-bar"></div>';
			$body.append(template);
			$progressBar = $("#progressBar");
			$progressBar.show();
			setStatus(0);
		};
		var setStatus = function(progress){
			$progressBar.attr("data-progress", progress);
		};
		var loader = function(){
			var width = parseFloat($progressBar.attr("data-progress"));
			var progress = width+Math.random(0, 1)/10;
			if(progress > 1){
				progress = 1;
				that.removeProgress(function(){
					defaults.callback();
				});
			}
			else{
				that.updateProgress(progress);
				loadTimer = setTimeout(loader, defaults.speed);
			}
		};
		public.getLoaderTimer = function(){
			return loadTimer;
		};
		public.clearLoaderTimer = function(){
			clearTimeout(loadTimer);
			loadTimer = null;
		};
		/**
		 * 更新进度条
		 * @param integer progressValue 当前进度
		 * @param function callback 回调函数
		 */
		public.updateProgress = function(progressValue, callback){
			var width = progressValue*100+"%";
			setStatus(progressValue);
			$progressBar.stop().animate({
				width : width
			}, aniSpeed, "swing", function() {
				if($.isFunction(callback)){
					callback(progressValue);
				}
			});
		};
		public.removeProgress = function(callback){
			$progressBar.fadeOut(aniSpeed, function() {
				that.destroy();
				if($.isFunction(callback)){
					callback();
				}
			});		
		};
		public.getProgressBar = function(){
			return $progressBar;
		};
		public.getStatus = function(){
			return parseFloat($progressBar.attr("data-progress"));
		};
		public.start = function(){
			var progressValue = this.getStatus();
			setStatus(progressValue);
			loader();
		};
		public.done = function(){
			this.clearLoaderTimer();
			this.updateProgress(1, function(){
				that.removeProgress(function(){
					defaults.callback();
				});
			});
		};
		public.init = function(){
			create();
		};
		public.destroy = function(){
			if(loadTimer != null){
				this.clearLoaderTimer();
			}
			$progressBar.stop();
			$progressBar.remove();
			$progressBar = null;
		};
	};
});
