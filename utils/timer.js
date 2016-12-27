/**
 * 定时器
 *
 * @config integer timerNum 时间
 * @config function everyCallback 每次调用执行的回调函数
 * @config function endCallback 计时器销毁时执行的回调函数
 *
 */
(function(top){
	var KTimer = top.KTimer = function(config){
		var that = this;
		var public = KTimer.prototype;
		var defaults = {
			timeNum : 10,
			everyCallback : function(currentTime){
				return true;
			},
			endCallback : function(currentTime){
				return true;
			}
		};
		var timer = null;
		var delay = 1000;
		var play = function(){
			var end = new Date().getTime();
			timeNum--;
			defaults.everyCallback(timeNum);
			if(end - start >= timeTotal){
				that.clearTimer();
				defaults.endCallback();
				return;
			}
		};
		var createTimer = function(){
			var start = new Date().getTime();
			$.extend(true, defaults, config);		
			var timeNum = defaults.timeNum;
			var timeTotal = timeNum*delay;
			play();
		};
		public.clearTimer = function(){
			clearInterval(timer);
			timer = null;
		};
		public.init = function(){
			timer = setInterval(createTimer, delay);
		};
	};
})(window);