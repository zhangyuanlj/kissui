/*
 * 获取浏览器信息
 * author:张渊
 * modifyTime:2015-11-27
 */
Ks().package("K", function(Ks){
	this.Browser = Ks.interface({
		//判断浏览器使用的语言
		getLan : function(){
			return (navigator.browserLanguage || navigator.language).toLowerCase()
		},
		/**
		 * 获取浏览器版本及内核
		 *
		 * @return object 浏览器版本及内核
		 * {
		 * 	   trident : IE内核
		 * 	   presto : opera内核
		 * 	   webKit : 苹果、谷歌内核
		 * 	   gecko : 火狐内核
		 * 	   safari : 苹果safari浏览器
		 * 	   mobile : 是否为移动终端
		 * 	   ios : ios终端
		 * 	   android : android终端
		 * 	   iPhone : 是否为iPhone
		 * 	   iPad : 是否iPad
		 * } 
		 *
		 */
		getBrowser : function(){
			var u = navigator.userAgent;
			return {
				trident : u.indexOf('Trident') > -1 || u.indexOf('MSIE') > -1, 
				presto : u.indexOf('Presto') > -1,
				webKit : u.indexOf('AppleWebKit') > -1, 
				gecko : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, 
				safari : u.indexOf('Safari') > -1,
				mobile : !!u.match(/Mobile/), 
				ios : !!u.match(/(i[^;]+\;(U;)? CPU.+Mac OS X)/), 
				android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, 
				iPhone : u.indexOf('iPhone') > -1,
				iPad : u.indexOf('iPad') > -1
			};
		},
		/**
		 * 获取IE浏览器版本
		 *
		 * @return string||boolean 返回浏览器版本号，如果不是IE浏览器则返回false
		 *
		 */
		getIeVer : function(){
			if(!this.getBrowser().trident){
				return false;
			}
			var u = navigator.userAgent;
			if(/MSIE/i.test(u)){
		        return u.match(/MSIE (\d+\.\d+)/i)[1];
		    }
		}
	});
});