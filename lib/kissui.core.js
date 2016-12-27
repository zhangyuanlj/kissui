(function(tn, $){
	"use strict";
	var VERSION = "1.3.0";
	var ABOUT = "KISSUI 一款优雅简洁的前端组件库\nversion:"+VERSION+" Copyright (c) 2014, All rights reserved.";
	var topNamespace = tn;
	var KissUi = function(config){
		var self = this;
		if(!(this instanceof KissUi)){
			self = new KissUi(config);
		}
		else{
			self = this._init();
		}
		return self;
	};
	KissUi.prototype = {
		version : VERSION,
		about : ABOUT,
		_init : function(){
			this.constructor = KissUi;
			return true;
		},
		/**
		 * 创建一个类，实现类的继承
		 * @param object superClass 父类
		 * @param object prop 创建类的属性
		 */
		creatClass : function(){
			var arguLen = arguments.length;
			var superClass = arguments[0];
			var prop = arguments[arguLen-1];
			prop.init = prop.init ? prop.init : function(){};
			var newClass = function(){
				if(this instanceof newClass){
					return this.init.apply(this, arguments);
				}
			};
			if(arguLen === 1){
				newClass.prototype = prop;
			}
			else if(arguLen === 2){
				var tempClass = function(){};
				tempClass.prototype = superClass.prototype;
				var supProp = tempClass.prototype;
				newClass.prototype = new tempClass();
				var subProp = newClass.prototype;
				for(var name in prop){
					subProp[name] = (function(name, propItem){
						if(supProp[name] && typeof supProp[name] == "function" && typeof propItem == "function"){
							return function(){
								this.callSuper = supProp[name];
								return propItem.apply(this, arguments);
							};
						}
						else{
							return propItem;
						}
					})(name, prop[name]);
				}
			}
			return newClass;
		},
		/**
		 * 实现一个接口
		 * @param object prop 创建接口的属性
		 * @return object 接口对象
		 */
		interface : function(prop){
			return prop ? prop : {};
		},
		/**
		 * 创建命名空间
		 * @param string name 命名空间字符串
		 * @return object 命名空间末尾对象的引用
		 */
		namespace : function(name){
			if(!name){
				return topNamespace;
			}
			var topNs = topNamespace,
				nsList = name.split("."),
				len = nsList.length;
			for(var i = 0; i < len; i++){
				var nsKey = nsList[i];
				topNs[nsKey] = topNs[nsKey] ? topNs[nsKey] : {};
				topNs = topNs[nsKey];							
			}
			return topNs;
		},
		/**
		 * 创建一个匿名函数包
		 * @param string||object name 命名空间
		 * @param function func 向包内注入的方法
		 */
		package : function(){
			var arguLen = arguments.length;
			var name = arguments[0];
			var func = arguments[arguLen-1];
			var ns = topNamespace
			if(typeof func == "function"){
				if(typeof name == "string"){ 
					ns = this.namespace(name);
				}
				else if(typeof name == "object"){ 
					ns = name;
				}
				func.call(ns, this);
			}
			else{
				var logText = "必须传入一个方法";
				this.logError(logText);
			}
		},
		/**
		 * 输出错误信息
		 * @param string logText 错误信息
		 */
		logError : function(logText){
			console.error("运行脚本时出错:"+logText);
		},
		/**
		 * 输出一个方法的执行时间
		 * @param function func 需要测试的方法
		 */
		logRunTime : function(func){
			if(typeof func == "function"){
				var startTime = new Date().getTime();
				func();
				var endTime = new Date().getTime();
				var logText = "该方法耗时："+(endTime-startTime)+"ms";
				console.log(logText);
			}
			else{
				var logText = "请检查您传入的参数是否为函数！";
				this.logError(logText);
			}
		}
	};
	topNamespace.Ks = topNamespace.KissUi = KissUi;
})(window, window.jQuery||window.Zepto);