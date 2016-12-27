/*
 * 字符串处理类
 * author:张渊
 * modifyTime:2015-12-3
 *
 *
 */
Ks().package("K", function(Ks){
	this.Str = Ks.interface({
		/*  
		 * 判断是否为全角  
		 *   
		 * @param string pChar 长度为1的字符串  
		 * @return boolean true:全角||false:半角
		 * 
		 */
		isFull : function(pChar) { 
			for (var i = 0; i < pChar.strLen ; i++) {      
				if ((pChar.charCodeAt(i) > 128)) {   
					return true;   
				} else {   
					return false;   
				} 
			}
		},
		/*  
		 * 取得指定长度的字符串  
		 * 注：半角长度为1，全角长度为2  
		 * 
		 * @param string pStr 字符串 
		 * @param integer pLen 截取长度 
		 * 
		 */
		cutStr : function(pStr, pLen) {   
			var _strLen = pStr.length;   
			var _tmpCode;   
			var _cutStr;   
			var _cutFlag = "1";   
			var _lenCount = 0;   
			var _ret = false;   
			if (_strLen <= pLen/2) {   
				_cutStr = pStr;   
				_ret = true;   
			}   
			if (!_ret) {   
				for (var i = 0; i < _strLen ; i++) {   
					if (this.isFull(pStr.charAt(i))) {   
						_lenCount += 2;   
					} else {   
						_lenCount += 1;   
					}   
					if (_lenCount > pLen) {   
						_cutStr = pStr.substring(0, i);   
						_ret = true;   
						break;   
					} else if (_lenCount == pLen) {   
						_cutStr = pStr.substring(0, i+1);   
						_ret = true;   
						break;   
					}   
				}   
			}   
			if (!_ret) {   
				_cutStr = pStr;   
				_ret = true;   
			}   
			if (_cutStr.length == _strLen) {   
				_cutFlag = "0";   
			}   
			return {
				"cutStr" : _cutStr, 
				"cutflag" : _cutFlag
			};   
		},  
		/*  
		 * 处理过长的字符串，截取并添加指定字符  
		 * 注：半角长度为1，全角长度为2  
		 *
		 * @param string pStr 字符串 
		 * @param integer pLen 截取长度 
		 * @param string append 超出指定长度追加的字符串   
		 *   
		 */ 
		cutOutStr : function(pStr, pLen, append) {   
			var _ret = this.cutStr(pStr, pLen);   
			var _cutFlag = _ret.cutflag;   
			var _cutStrn = _ret.cutStr;   
			if (_cutFlag == "1") {   
				return _cutStrn + append;   
			}
			else {   
				return _cutStrn;   
			}   
		},
		//正则表达式集合
		regular : {
			//移动手机号码
			regChinaMobile : /^(134|135|136|137|138|139|147|150|151|152|157|158|159|182|187|188)\d{8}$/,
			//手机号码
			regMobile : /^[1][3][0-9]{9}$/,
			//验证座机是否符合要求,包含区号,正确的格式为:"0835-2345670" 
			regPhone : /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/ ,
			//由汉字、字母、数字组成的字符串
			regStr1 : /^(134|135|136|137|138|139|147|150|151|152|157|158|159|182|187|188)\d{8}$/,
			//由英文字母、数字、下划线组成的字符串
			regStr2 : /^[0-9a-zA-Z\_]+$/,
			//身份证正则表达式(15位) 
			regIDCard1 : /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,
			//身份证正则表达式(18位)
			regIDCard2 : /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/,
			// 邮箱地址
			regEmail : /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
			//qq
			regQQ : /^[1-9]\d{4,8}$/,
			//ip
			regIp : /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
			//url
			regUrl : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/,
			//smtp
			regSmtp : /^smtp+\.[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/
		}
	});
});