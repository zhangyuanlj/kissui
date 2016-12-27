<?php
	$id = isset($_REQUEST["id"]) ? $_REQUEST["id"] : "";
	$classid = isset($_REQUEST["classid"]) ? $_REQUEST["classid"] : "";
	$res = array();
	if($id == ""){
		$res = array(
			"succeed" => 1,
			"data" => array(
				"isParent" => true,
				"list" => array(
					0 => array(
						"id" => 1,
						"parentId" => 0,
						"name" => "四川驹马企业管理有限公司",
						"checked" => true,
						"disable" => false,
						"expand" => false, 
						"icon" => "treeview-icon2",
						"isParent" => true
					)
				)
			)
		);
	}
	else if($id == 1){
		$res = array(
			"succeed" => 1,
			"data" => array(
				"isParent" => true,
				"list" => array(
					0 => array(
						"id" => 2,
						"parentId" => $id,
						"name" => "行政部",
						"checked" => true,
						"disable" => false,
						"expand" => false, 
						"icon" => "",
						"isParent" => false
					),
					1 => array(
						"id" => 3,
						"parentId" => $id,
						"name" => "研发部",
						"checked" => true,
						"disable" => false,
						"expand" => false,
						"icon" => "",
						"isParent" => true
					),
					2 => array(
						"id" => 4,
						"parentId" => $id,
						"name" => "业务部",
						"checked" => false,
						"disable" => true,
						"expand" => false,
						"icon" => "",
						"isParent" => false
					),
					3 => array(
						"id" => 14,
						"parentId" => $id,
						"name" => "腾讯",
						"checked" => true,
						"disable" => false,
						"expand" => false,
						"icon" => "",
						"isParent" => true
					),
					4 => array(
						"id" => 16,
						"parentId" => $id,
						"name" => "百度",
						"checked" => true,
						"disable" => false,
						"expand" => false,
						"icon" => "",
						"isParent" => true
					)
				)
			)
		);
	}
	else if($id == 3 && $classid == ""){
		$pageSize = 20;
		$res = array(
			"succeed" => 1,
			"data" => array(
				"isParent" => true,
				"list" => array()
			)
		);
		for($i = 0; $i < $pageSize; $i++){
			$res["data"]["list"][$i] = array(
				"id" => ($i+1)*5,
				"parentId" => $id,
				"name" => "部门职员".($i+1),
				"checked" => true,
				"disable" => false,
				"expand" => false,
				"icon" => "treeview-icon3",
				"isParent" => false
			);
		}
	}
	else if($id == 14 || $id == 554){
		$res = array(
			"succeed" => 1,
			"data" => array(
				"isParent" => false,
				"list" => array()
			)
		);
		for($i = 0; $i < 10; $i++){
			$res["data"]["list"][$i] = array(
				"id" => ($i+1)*($id+1),
				"parentId" => $id,
				"name" => "部门职员".($i+1),
				"checked" => true,
				"disable" => false,
				"expand" => false,
				"icon" => "treeview-icon3",
				"isParent" => false
			);
		}
	}
	elseif($id == 16 || $id == 90){
		$res = array(
			"succeed" => 1,
			"data" => array(
				"isParent" => true,
				"list" => array(
					0 => array(
						"id" => 52,
						"parentId" => $id,
						"name" => "刘琴",
						"checked" => true,
						"disable" => false,
						"expand" => false,
						"icon" => "treeview-icon3",
						"isParent" => false
					),
					1 => array(
						"id" => 53,
						"parentId" => $id,
						"name" => "尹建明",
						"checked" => true,
						"disable" => false,
						"expand" => false,
						"icon" => "treeview-icon3",
						"isParent" => false
					),
					2 => array(
						"id" => 554,
						"parentId" => $id,
						"name" => "万译文",
						"checked" => true,
						"disable" => false,
						"expand" => false,
						"icon" => "",
						"isParent" => true
					),
					3 => array(
						"id" => 55,
						"parentId" => $id,
						"name" => "叶晓鹿",
						"checked" => true,
						"disable" => false,
						"expand" => false,
						"icon" => "treeview-icon3",
						"isParent" => false
					)
				)
			)
		);
	}
	echo json_encode($res);
?>