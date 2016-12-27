/*
颜色选择器
http://code.ciaoca.cn/
日期：2012-09-14

settings 参数说明
-----
color:默认颜色
title:关联的元素
------------------------------ */
(function($){
	$.fn.colorSelect=function(settings){
		if(this.length<1){return;};

		// 默认值
		settings=$.extend({
			color:"#000000",
			title:null
		},settings);

		var color_obj=this;
		if(color_obj.val().length>0){
			settings.color=color_obj.val();
		};

		// 创建选择器
		var color_pane,block_bg,temp_html;
		color_pane=$("<div></div>",{"class":"html_colorpane"}).appendTo("body");

		// 初始化选择器面板
		var color_hex=["00","33","66","99","cc","ff"];
		var spcolor_hex=["ff0000","00ff00","0000ff","ffff00","00ffff","ff00ff"];

		temp_html="<h5>清除颜色</h5><table>";
		for(var i=0;i<2;i++){
			for(var j=0;j<6;j++){
				temp_html+="<tr>";
				temp_html+="<td title='#000000' style='background-color:#000000'>";
				if(i==0){
					temp_html+="<td title='#"+color_hex[j]+color_hex[j]+color_hex[j]+"' style='background-color:#"+color_hex[j]+color_hex[j]+color_hex[j]+"'>";
				}else{
					temp_html+="<td title='#"+spcolor_hex[j]+"' style='background-color:#"+spcolor_hex[j]+"'>";
				};
				temp_html+="<td title='#000000' style='background-color:#000000'>";
				for(var k=0;k<3;k++){
					for(var l=0;l<6;l++){
						temp_html+="<td title='#"+color_hex[k+i*3]+color_hex[l]+color_hex[j]+"' style='background-color:#"+color_hex[k+i*3]+color_hex[l]+color_hex[j]+"'>";
					};
				};
			};
		};
		temp_html+="</table>";
		color_pane.html(temp_html);
		
		// 背景遮挡层
		block_bg=$("<div></div>").css({"display":"none","position":"absolute","top":"0","left":"0","background":"#fff","opacity":"0","z-index":"999"}).appendTo("body");

		// 更改颜色函数
		var colorThis=function(c){
			color_obj.val(c).css("backgroundColor",c);
			if(settings.title!=null){
				$(settings.title).css("color",c);
			};
		};

		// 关闭日期函数
		var colorExit=function(){
			color_pane.hide();
			block_bg.hide();
		};

		var color_title,color_table;
		color_title=color_pane.find("h5");
		color_table=color_pane.find("table");

		// 选择颜色事件
		color_table.delegate("td","click",function(){
			var color_val=this.title;
			colorThis(color_val);
			colorExit();
		});

		// 显示面板事件
		color_obj.bind("click",function(){
			var doc_w=document.body.clientWidth;
			var doc_h=document.body.clientHeight;
			var pane_w=color_pane.outerWidth();
			var pane_h=color_pane.outerHeight();
			var pane_top=color_obj.offset().top;
			var pane_left=color_obj.offset().left;
			var obj_w=color_obj.outerWidth();
			var obj_h=color_obj.outerHeight();
			
			pane_top=((pane_top+pane_h+obj_h)>doc_h) ? pane_top-pane_h : pane_top+obj_h;
			pane_left=((pane_left+pane_w)>doc_w) ? pane_left-(pane_w-obj_w) : pane_left;

			color_pane.css({"top":pane_top,"left":pane_left}).show();
			block_bg.css({width:doc_w,height:doc_h}).show();
		});

		// 清除颜色事件
		color_title.bind("click",function(){
			colorThis(settings.color);
			colorExit();
		});

		// 关闭面板事件
		block_bg.bind("click",function(){
			colorExit();
		});

		// 第一次初始化
		colorThis(settings.color);
	};
})(jQuery);