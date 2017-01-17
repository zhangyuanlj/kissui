/*
 * 定时器
 * author:张渊
 * modifyTime:2015-12-27
 */
 Ks().package("K", function(Ks){
 	this.Timer = Ks.creatClass({
 		timer : {},
 		_createTimer : function(){
 			var self = this;
 			var timerId = null;
 			var defaults = this.defaults;	
 			var timeNum = defaults.timeNum;
 			var play = function(){
 				timeNum--;
 				if(timeNum && typeof defaults.everyCallback == "function"){		
 					defaults.everyCallback(timeNum);
 				}
 				if(timeNum <= 0){
 					self.clearTimer(timerId);
 					if(typeof defaults.endCallback == "function"){
 						defaults.endCallback();
 					}
 					return;
 				}
 			};
 			var timerId = setInterval(play, this.defaults.delay);
 			this.timer[timerId] = timerId;
 		},
 		/**
		 * 清除指定的计时器
	     * @param integer timerId 计时器ID
		 */
 		clearTimer : function(timerId){
 			clearInterval(this.timer[timerId]);
 			this.timer[timerId] = null;
 		},
 		//清除所有计时器
 		clearAllTimer : function(){
 			for(var i in this.timer){
 				clearInterval(this.timer[i]);
 				this.timer[i] = null;
 			}
 			this.timer = {};
 		},
 		getTimer : function(){
 			return this.timer;
 		},
 		init : function(options){
 			this.defaults = {
 				timeNum : 10,
 				delay : 1000,
 				everyCallback : function(currentTime){
 					return true;
 				},
 				endCallback : function(currentTime){
 					return true;
 				}
 			};
 			$.extend(true, this.defaults, options);		
 			this._createTimer();
 		}
 	});
 });