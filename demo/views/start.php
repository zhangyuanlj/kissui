<!DOCTYPE HTML>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="renderer" content="webkit">
<meta name="description" content="KISSUI一款基于jQuery的优雅简洁的前端组件库">
<meta name="author" content="zhangyuanlj13@163.com">
<meta name="keywords" content="KISSUI一款优雅简洁的前端组件库">
<title>KISSUI一款优雅简洁的前端组件库</title>
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.main.css" />
<link type="text/css" rel="stylesheet" href="../css/de.content.css" />
<script type="text/javascript" src="../../lib/jquery/jquery.min.js"></script>
<script type="text/javascript">
	$(function(){
		var $left = $("#conLeft");
		var $goTop = $("#goTop");
		$(window).bind("scroll", function(){
			var $this = $(this);
			if($this.scrollTop() > 100){
				$left.addClass("de-conleft-fixed");
				$goTop.show();
			}
			else{
				$left.removeClass("de-conleft-fixed");
				$goTop.hide();	
			}
		});
	});
</script>
</head>
<body>
	<?php include "header.php";?>
    <div class="de-width1000">
        <div class="de-content">
        	<?php include "start/left.html";?>
        	<div class="de-content-right">
            	<?php 
					$page = isset($_GET["page"]) ? $_GET["page"] : "standard";
					include "start/".$page.".html";
				?>
            </div>
        </div>
    </div>
    <a href="javascript:void(0);" id="goTop" class="de-go-top" onClick="$(window).scrollTop(0);"></a>
</body>
</html>
