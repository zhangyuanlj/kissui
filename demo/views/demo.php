<!DOCTYPE HTML>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="renderer" content="webkit">
<meta name="description" content="Kissui一款基于jQuery的优雅简洁的前端组件库">
<meta name="author" content="zhangyuanlj13@163.com">
<meta name="keywords" content="Kissui一款优雅简洁的前端组件库">
<title>Kissui一款优雅简洁的前端组件库</title>
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.main.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.btn.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.datepicker.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.dropdown.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.form.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.paging.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.poplayer.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.tooltip.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.treeview.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.upload.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.loader.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.panel.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.tab.css" />
<link type="text/css" rel="stylesheet" href="../../web/styles/kissui.page.css" />
<link type="text/css" rel="stylesheet" href="../css/de.content.css" />
<link type="text/css" rel="stylesheet" href="../js/highlight/styles/atelier-dune-light.css" />
<script type="text/javascript" src="../../lib/jquery/jquery.min.js"></script>
<script type="text/javascript" src="../../lib/kissui.core.js"></script>
<script type="text/javascript" src="../../src/kissui.position.js"></script>
<script type="text/javascript" src="../../src/kissui.rendercomp.js"></script>
<script type="text/javascript" src="../js/highlight/highlight.js"></script>
<script type="text/javascript">
	$(function(){
		var $left = $("#conLeft");
		var $goTop = $("#goTop");
		$("pre code").each(function(i, block) {
			hljs.highlightBlock(block);
		});
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
        	<?php include "demo/left.html";?>
        	<div class="de-content-right">
            	<?php 
					$page = isset($_GET["page"]) ? $_GET["page"] : "btn";
					include "demo/".$page.".html";
				?>
            </div>
        </div>
    </div>
    <a href="javascript:void(0);" id="goTop" class="de-go-top" onClick="$(window).scrollTop(0);"></a>
</body>
</html>
