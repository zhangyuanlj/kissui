<?php
	$menu = isset($_GET["menu"]) ? $_GET["menu"] : "start";
?>
<div class="de-header">
  <div class="de-width1000">
      <h2 onClick="location.href='../index.html';"></h2>
      <ul class="de-nav">
          <li <?php if($menu=="start"){?>class="active"<?php }?>><a href="start.php?menu=start">开始使用</a></li>
          <li <?php if($menu=="demo"){?>class="active"<?php }?>><a href="demo.php?menu=demo">WEB组件</a></li>
          <li <?php if($menu=="appDemo"){?>class="active"<?php }?>><a href="app.demo.php?menu=appDemo">移动端组件</a></li>
          <?php /*?><li <?php if($menu=="about"){?>class="active"<?php }?>><a href="about.php?menu=about">关于我们</a></li><?php */?>
      </ul>
  </div>
</div>