/*
 * 常用工具类
 * author:张渊
 * modifyTime:2016-7-22
 */
Ks().package("K", function(Ks){
	this.Utils = Ks.interface({
		/**
		 * 跳转
		 * @param string url 地址
		 * @param object param 浏览器参数
		 */
		location : function(url, param){
		 	var locUrl = url;
		 	if(param){
			 	var paramArr = [];
			 	for(var i in param){
			 		paramArr.push(param[i]);
			 	}
			 	locUrl = url+"?"+paramArr.join("&");
		 	}
		 	location.href = locUrl;
		 },
		/*  
		 * 获取文件后缀名
		 *  
		 * @param string fileName 文件名
		 *   
		 */
		getFileSuffix : function(fileName){
		 	var suffix = /\.[^\.]+$/.exec(fileName); 
		 	return suffix;
		},
		/**
		 * 给地址设置时间戳，防止缓存
		 *
		 * @param string url 地址
		 *
		 */
		addTimeStamp : function(url){
			var date = new Date();
			var connect = "?";
			if(url.indexOf("?") != -1){
				connect = "&";
			}
			return url + connect + "timeStamp="+date.getTime();
		},
		/*  
		 * 获取当前地理位置
		 *  
		 * @param function callback 地理位置获取成功后执行的回调函数
		 */
		getLocation : function(callback){
		 	var gps = navigator.geolocation;
		 	if (gps){
		 		gps.getCurrentPosition(function(position){
		 			//经纬度
		 			var lat = position.coords.latitude;
		 			var long = position.coords.longitude;
		 			callback(lat, long);
		 		},
		 		function(error){
		 			alert("Got an error, code: " + error.code + " message: "+ error.message);
					 }, {maximumAge: 10000}); // 这里设置超时为10000毫秒，即10秒
		 	}
		 	else{
		 		alert("你的浏览器不支持 Geolocation API！");
		 	}
		},
		//取地址栏参数,如果不存在返回空字符串
		getUrlParam : function(paramName){
			var svalue = window.location.search.match(new RegExp("[\?\&]" + paramName + "=([^\&]*)(\&?)", "i" ));
			return svalue ? svalue[1] : "";
		},
		//刷新当前页面
		refresh : function(){
		    window.location.reload();
		},
		//后退
		goBack : function(){
		    window.history.back();
		},
		//前进
		goForward : function(){
			window.history.forward();
		},
		/**
		 * 延迟执行一个函数
		 *
		 * @param function callback 回调函数
		 * @param integer delayTime 延迟时间，毫秒为单位
		 *
		 */
		delayFunc : function(callback, delayTime){
    		setTimeout(callback, delayTime);
    	},
		/*  
		 * 设置同域ifame高度
		 *  
		 * @param string||object iframeId iframe对象
		 *   
		 */
		setIframeH : function(iframeId){
			$(iframeId).load(function(){
				var mainHeight = $(this).contents().find("body").height()+30;
				$(this).height(mainHeight);
			}); 
		}
	});
});
