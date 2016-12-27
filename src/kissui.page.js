/**
  * JS异步分页
  * author:张渊
  * modifyTime:2015-12-14
  *
  * insertObj : "#page",                     //插入分页的目标对象
  * pageSize: 10,                            //每页显示多少条记录
  * pageCount: 10,                           //每段显示的页码
  * offsetPage: 4,                           //页码偏移数 
  * prevText : "< 上一页",                   //上一页链接文字
  * nextText : "下一页 >",                   //下一页链接文字
  * openInfor: true,                         //是否开启详细信息
  * callback : function(){                   //前往目标页码执行的回调函数
	  return false;	
  }
  *
  * 
  */
(function(top, $){
	var KPage = top.KPage = function(config){
		var that = this;
		var public = KPage.prototype;
		var pageHtml = "";                  
		var defaults = {                           
			insertObj : "#page",                 
			pageSize: 10,              
			pageCount: 10,             
			offsetPage: 4,             
			prevText : "< 上一页",     
			nextText : "下一页 >",      
			openInfor: true,           
			callback : function(){
				return false;	
			}
		};
		$.extend(defaults, config);
		this.currentPage = 1;
		this.dataNum = 0;
		this.$insertObj = $(defaults.insertObj);
		//计算分页
		var computePage = function(){
			return Math.ceil(that.dataNum / defaults.pageSize);
		};
		//分页详细信息
		var pageInfor = function(pageNum){
			var pageHtml = "<span>" + that.dataNum + "条记录</span> <span>"
						 + that.currentPage + "/" + pageNum + " 页</span> ";
			return pageHtml;
		};
		//分页偏移算法
		var getOffset = function(pageNum){
			var offsetVal = [];
			var startPage = 0;
			var endPage = 0;
			if(that.currentPage >= defaults.pageCount){
			   startPage = that.currentPage - defaults.offsetPage;
			   if(that.currentPage < pageNum && startPage + defaults.pageCount - 1 < pageNum){
				   endPage = defaults.pageCount + that.currentPage - defaults.offsetPage - 1;
			   }
			   else{
				   endPage = pageNum;
			   }
			}
			else{
			   startPage = 1;
			   if(pageNum > defaults.pageCount){
				   endPage = defaults.pageCount;
			   }
			   else{
				   endPage = pageNum;
			   }
			} 
			offsetVal[0] = startPage;
			offsetVal[1] = endPage;
			return offsetVal;
		};
		//创建分页
		var createPage = function(pageNum){
			 var pageHtml = "";
			 var offsetVal = getOffset(pageNum);
			 if(that.currentPage == 1){
				pageHtml += "<span class=\"prev\">" + defaults.prevText + "</span> ";
			 }
			 else{
				 pageHtml += "<a href=\"javascript:;\" class=\"prev\">" + defaults.prevText + "</a> ";
			 }
			 for(var i = offsetVal[0]; i <= offsetVal[1]; i++){ 
				if(i == that.currentPage){
				   pageHtml += "<span class=\"current\">" + i + "</span>";
				}
				else{
				   pageHtml += "<a href=\"javascript:;\" class=\"num\">" + i + "</a>";
				}
			 }
			 if(pageNum > defaults.pageCount){
				 if(defaults.pageCount - defaults.offsetPage - 1 + that.currentPage < pageNum || that.currentPage < defaults.pageCount){
					  pageHtml += "<span class=\"more\">...</span>";
					  pageHtml += "<a href=\"javascript:;\" class=\"num\">" + pageNum + "</a>";
				 }
			 }
			 if(that.currentPage == pageNum){
				 pageHtml += "<span class=\"next\">" + defaults.nextText + "</span> ";
			 }
			 else{
				 pageHtml += "<a href=\"javascript:;\" class=\"next\">" + defaults.nextText + "</a>";
			 }
			 return pageHtml;
		};
		//是否允许向前翻页
		var checkPrev = function(){
			if(that.currentPage == 1){
				return false;
			}
			return true;
		};
		//是否允许向后翻页
		var checkNext = function(pageNum){
			if(that.currentPage == pageNum){
				return false;
			}
			return true;
		};
		var registerEvent = function(){
			$(defaults.insertObj + " .prev").die().live("click", function(){
				that.goPrev();
			});
			$(defaults.insertObj + " .next").die().live("click", function(){
				that.goNext();
			});
			$(defaults.insertObj + " .num").die().live("click", function(){
				var pageNum = parseInt($(this).text());
				that.goTargetPage(pageNum);
			});
		};
		var setPageNum = function(pageNum){
			that.$insertObj.attr("data-page", pageNum);
		};
		public.getPageNum = function(){
			var pageNum = parseInt(this.$insertObj.attr("data-page"));
			if(isNaN(pageNum)){
				pageNum = 1;
			}
			return pageNum;
		};
		//上一页
		public.goPrev = function(){
			if(checkPrev()){
				this.currentPage--;			
				this.updatePage();
				setPageNum(this.currentPage);
				defaults.callback();
			}
		};
		//下一页
		public.goNext = function(){
			var pageNum = computePage();
			if(checkNext(pageNum)){
				this.currentPage++;
				this.updatePage();
				setPageNum(this.currentPage);
				defaults.callback();
			}
		};
		public.goTargetPage = function(pageNum){
			this.currentPage = pageNum;
			this.updatePage();
			setPageNum(this.currentPage);
			defaults.callback();
		};
		//更新分页控件
		public.updatePage = function(){
			var pageNum = computePage();
			var pageHtml = "";
			if(defaults.openInfor){
				pageHtml = pageInfor(pageNum);
			}
			pageHtml += createPage(pageNum);
			setPageNum(that.currentPage);
			this.$insertObj.html(pageHtml);
		};
		public.init = function(){
			registerEvent();
		};
	};
})(window, jQuery);