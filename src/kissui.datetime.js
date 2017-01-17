/*
 * 日期时间
 * author:张渊
 * modifyTime:2015-11-12
 */
Ks().package("K", function(Ks){
	this.DateTime = function(config){
		var that = this;
		var weekdays = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
		var timer = null;     //计时器
		var defaults = {
			wirteTimeObj : "dateTime",
			formate : "YYYY-MM-DD"
		};
		//设置config
		function _setConfig(config){
			if(typeof config != "object"){
				throw new Error("配置参数必须为对象类型！！！");
			}
			for(var i in config){
				if(config[i] == "body"){
					config[i] = document.body;
				}
				defaults[i] = config[i];
			}
		}
		//获取显示日期时间的对象
		function _getId(id){
			return document.getElementById(id);
		}
		//打印时间
		function _printTime(){
			var wirteTimeObj = _getId(defaults.wirteTimeObj);
			var dateValue = that.getDate();
			//返回的时间字符串
			var dateStr = _formateFunc(dateValue);     
			wirteTimeObj.innerHTML = dateStr;
		}
		function _formateFunc(dateValue){
			var formatString = defaults.formate;
			var o = {
				"M+" : dateValue.month+1,  
				"D+" : dateValue.day,   
				"h+" : dateValue.hours,  
				"m+" : dateValue.minute,
				"s+" : dateValue.second   
			}
			if(/(Y+)/.test(formatString)){
				formatString = formatString.replace(RegExp.$1, (dateValue.year+"").substr(4 - RegExp.$1.length));
			}
			for(var k in o){
				if(new RegExp("("+ k +")").test(formatString)){
					formatString = formatString.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
				}
			}
			if(/(W)/.test(formatString)){
				formatString = formatString.replace(RegExp.$1, dateValue.week+"");
			}
			return formatString;
		}
		//获取详细的日期时间信息
		this.getDate = function(){
			var date = new Date();             
			var year = date.getFullYear(); 
			var month = date.getMonth();     
			var day = date.getDate();
			var week = date.getDay();    
			var hours = date.getHours();      
			var minute = date.getMinutes();  
			var second = date.getSeconds();   
			return {
				year : year,
				month : month,
				day : day,
				week : weekdays[week],
				hours : hours,
				minute : minute,
				second : second
			};
		}
		//自动更新时间
		this.autoUpdate = function(){
			timer = setInterval(_printTime, 100);
		}
		//清除计时器
		this.clearTimer = function(){
			clearInterval(timer);
		}
		this.init = function(){
			_setConfig(config);
			_printTime();
		}
	};
});