/*
 * 配置文件
 * author:张渊
 * modifyTime:2016-10-25
 * 说明：如需增加模块，请在PATH中添加;依赖关系请在SHIM中定义;
 */
var APP_VERSION = "1.0.0";
var BASE_PATH = "/kissUi3.0/";
var JS_PATH = "";
var LIB_PATH = JS_PATH+"lib/";
var UNTIL_PATH = JS_PATH+"until/";
var PLUGIN_PATH = JS_PATH+"plugin/";
var SRC_PATH = JS_PATH+"src/";
//模块地址
var PATHS = {
	Jquery: LIB_PATH+"jquery/jquery.min",
	Zepto: LIB_PATH+"zepto/zepto.min",
	Zfx: LIB_PATH+"zepto/zepto.zfx.min",
	ZfxMethods: LIB_PATH+"zepto/zepto.zfx.methods.min"
};
//模块依赖关系
var SHIM = {};
//require.js配置
var REQUIRE_CONFIG = {
	//添加版本号
	urlArgs: "v=" + APP_VERSION,
	baseUrl: BASE_PATH,
	paths: PATHS,
	waitSeconds: 0,
	shim: SHIM
};
//控件配置
var WIDGET_CONFIG = {
	mask : {
		styleName : "ks-mask"
	},
	ajaxLoading : {
		styleName : "ks-loading1"
	},
	toast : {
		styleName : "ks-toast",
		pos : "center",
		showTime : 2000
	},
	dilog : {
		styleName : "ks-dilog",
		show : {
			opacity: 1
		},
		hide : {
			opacity: 0,
			translate: "0,43.2rem"
		}
	},
	panel : {
		styleName : "ks-select-panel",
		show : {
			opacity: 1,
			translate:"0,0"
		},
		hide : {
			opacity: 0,
			translate: "0,43.2rem"
		}
	}
};
//模板引擎配置
var TPL_CONFIG = {};
//控制器配置
var CONTROLLER_CONFIG = {
	Main : [
		'Jquery'
	]
};
var CONFIG = {
	animate : {
		speed : 300,
		slowType : "ease-in-out"
	},
	widget : WIDGET_CONFIG
};