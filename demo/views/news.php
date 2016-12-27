<?php
	header("Content-Type:text/xml; charset=utf-8");
	$page = isset($_GET["page"]) ? $_GET["page"] : 1;
	$pagesize = isset($_GET["pageSize"]) ? $_GET["pageSize"] : 1;
	$xmlstr = "<?xml version=\"1.0\" encoding=\"utf-8\"?><list>";
	for($i = 0; $i < $pagesize; $i++){
		$xmlstr .= "<items><title>(三中全会)全会将深化工商登记制度改革" . $page . "</title></items>";
	}
	$xmlstr .= "<dataNum>19</dataNum></list>";
	echo $xmlstr;
?>