/*
 * 无限级树目录
 * author:张渊
 * modifyTime:2016-12-8
 */
(function($){
	var KTreeView = function(config){
		this.$treeView = null;
		this.defaultNodeId = -1;
		this.isRoot = true;
		this.page = 1;
		this.maxLoadLen = 100;
		this.config = {
			$parent : $("#treeWrapper"),
			keyName : "id",
			action : {
				init : "initTree.php",
				getChild : "getChildTree.php"
			},
			expandAll : false,
			loadingCallback : function(){
				return true;
			},
			successCallback : function(){
				return true;
			},
			expandCallback : function(){
				return true;
			},
			nodeCallback : function(nodeValue){
				return true;
			},
			checkedCallback : function(){
				return true;
			},
			unCheckedCallback : function(){
				return true;
			}
		};
		this._setConfig(config);
		this._init();
	};
	KTreeView.prototype = {
		/**
		 * 设置config
		 * @param Object config 配置项
		 */
		_setConfig : function(config){
			if(!config){
				return false;
			}
			$.extend(true, this.config, config);
		},
		_init : function(){
			var _config = this.config;
			this._render(_config);
			this._loadTree(this.defaultNodeId, _config.action.init, false);	
			this._expandEvent();
			this._bindNodeEvent();
			this._nodeCheckedEvent();
		},
		/**
		 * 初始化树
		 * @param Object config 配置项
		 */
		_render : function(config){
			var $parent = config.$parent;
			var date = new Date();
			var treeViewId = "treeview-" + date.getTime();
			this.treeTemp = '<ul id="'+treeViewId+'"></ul>';
			this.treeListTemp = '<li class="ks-treeview-li" data-id="{{nodeId}}" data-parent-id="{{nodeParentId}}" data-title="{{node}}" data-disable="{{disable}}">'
							 +		'<a href="javascript:void(0);" class="ks-treeview-a{{disableStyle}}" title="{{node}}">'
							 +          '{{fold}}'
							 +          '{{checked}}'
							 +			'<strong class="ks-treeview-node">'
							 +				'{{icon}}{{node}}'
							 +			'</strong>'	
							 +		'</a>'
							 +      '{{children}}'
							 +  '</li>';
			$parent.html(this.treeTemp);
			this.$treeView = $("#"+treeViewId);
		},
		/**
		 * 加载数据成功回调
		 * @param Object paramList 参数列表
		 */
		_loadTreeSuccess : function(paramList){
			var that = this;
			var treeHtml = [];
			var data = paramList.res.data;
			var expandAll = this.config.expandAll;
			var isPartialLoad = false;
			if(paramList.res.succeed){
				var list = data.list;
				var dataLength = data.list.length;
				var totalPage = Math.ceil(dataLength / this.maxLoadLen);	
				if(dataLength > this.maxLoadLen){
					this.page++;
					dataLength = this.maxLoadLen;
					isPartialLoad = true;
				}	
				for(var i = 0; i < dataLength; i++){
					(function(index){
						var id = list[index].id;
						var prentId = list[index].parentId;
						var name = list[index].name;
						var checked = list[index].checked;
						var disable = list[index].disable;
						var expand = list[index].expand;
						var icon = list[index].icon;
						var isParent = list[index].isParent;
						var temp = that.treeListTemp;
						if(expandAll && isParent){
							expand = true;
						}
						if(icon == ""){
							if(isParent){
								icon = '<i class="ks-treeview-icon ks-treeview-picon"></i>';
							}
							else{
								icon = '<i class="ks-treeview-icon ks-treeview-cicon"></i>';
							}
						}
						else{
							icon = '<i class="ks-treeview-icon '+icon+'"></i>';
						}
						temp = temp.replace(/{{nodeId}}/g, id);
						temp = temp.replace(/{{nodeParentId}}/g, prentId);
						temp = temp.replace(/{{fold}}/g, isParent ? '<i class="ks-treeview-fold"></i>' : '<i class="ks-treeview-placehd"></i>');
						temp = temp.replace(/{{icon}}/g, icon);
						temp = temp.replace(/{{node}}/g, name);
						temp = temp.replace(/{{disable}}/g, disable);
						temp = temp.replace(/{{disableStyle}}/g, disable ? ' ks-treeview-disable' : '');
						temp = temp.replace(/{{checked}}/g, checked ? '<i class="ks-treeview-check"></i>' : '');
						temp = temp.replace(/{{children}}/g, isParent ? '<ul class="ks-treeview-child"></ul>' : '');
						treeHtml.push(temp);
						if(expand){	
							setTimeout(function(){
								that._expandNode(id);
							}, 100);
						}
					})(i);
				}
				if(that.isRoot){
					that.isRoot = false;  
				}
				else{
					paramList.$fold.removeClass("ks-treeview-loading");
					paramList.$list.attr("data-load", "true");
				}
				if(!isPartialLoad){
					paramList.$tree.html(treeHtml.join("\n"));
				}
				else{
					paramList.$tree.append(treeHtml.join("\n"));
					if(that.page <= totalPage){
						that._loadTree(paramList.nodeId, paramList.action, isPartialLoad);
					}
				}					
			}
		},
		/**
		 * 加载树
		 * @param Integer nodeId 节点ID,为-1时表示初始化根目录
		 * @param String action 请求地址
		 * @param Boolean isPartialLoad 是否分批加载
		 */
		_loadTree : function(nodeId, action, isPartialLoad){
			var $tree = this.$treeView;
			var $list = null;
			var $fold = null;
			var treeViewId = $tree.attr("id");
			var that = this;
			var _config = this.config;
			var requestData = {};
			if(nodeId != -1){
				requestData[_config.keyName] = nodeId;
			}
			if(isPartialLoad){
				requestData["page"] = this.page;
			}
			requestData["pageSize"] = this.maxLoadLen;
			if(!this.isRoot){
				$list = $("#"+treeViewId+" .ks-treeview-li[data-id='" + nodeId + "']");
				$childList = $("#"+treeViewId+" .ks-treeview-li[data-id='" + nodeId + "'] .ks-treeview-child").eq(0);
				$fold = $("#"+treeViewId+" .ks-treeview-li[data-id='" + nodeId + "'] .ks-treeview-a:eq(0) .ks-treeview-fold");
				$tree = $childList;
				$fold.addClass("ks-treeview-loading");
			}
			_config.loadingCallback();
			$.ajax({
				url: action,
				type: "POST",
				data: requestData,
				dataType : "json",
				success: function(res){
					var paramList = {
						$tree: $tree,
						$fold: $fold,
						$list: $list,
						res: res,
						nodeId: nodeId,
						action: action
					};
					that._loadTreeSuccess(paramList);
					that.config.successCallback();	
				}
			});
		},
		_expandEventFunc : function($node, treeViewId, _config){
			var $parent = $node.parents(".ks-treeview-li");
			var nodeId = $parent.attr("data-id");
			var parentId = $parent.attr("data-parent-id");
			var $list = $("#"+treeViewId+" .ks-treeview-li[data-id='" + nodeId + "'] .ks-treeview-child").eq(0);
			var $icon = $("#"+treeViewId+" .ks-treeview-li[data-id='" + nodeId + "'] .ks-treeview-a:eq(0) .ks-treeview-icon");
			var dataLoad = $parent.attr("data-load");
			var disable = $parent.attr("data-disable");
			if(disable == "true" || $node.hasClass("ks-treeview-loading")){
				return false;
			}
			if($node.hasClass("ks-treeview-fold-open")){
				$node.removeClass("ks-treeview-fold-open");
				if($icon.hasClass("ks-treeview-picon")){
					$icon.removeClass("ks-treeview-picon-open");
				}
				$list.hide();
			}
			else{
				$node.addClass("ks-treeview-fold-open");
				if($icon.hasClass("ks-treeview-picon")){
					$icon.addClass("ks-treeview-picon-open");
				}
				$list.show();
			}
			_config.expandCallback();
			if(dataLoad == "true"){
				return false;
			}
			this._expandNode(nodeId);
		},
		//绑定树展开关闭事件
		_expandEvent : function(){
			var $tree = this.$treeView;
			var treeViewId = $tree.attr("id");
			var $fold = $("#"+treeViewId+" .ks-treeview-fold");
			var that = this;
			var _config = this.config;
			$fold.die().live("click", function(e){
				that._expandEventFunc($(this), treeViewId, _config);
				e.stopPropagation();
			});
		},
		//给每个节点绑定事件
		_bindNodeEvent : function(){
			var $tree = this.$treeView;
			var treeViewId = $tree.attr("id");
			var $node = $("#"+treeViewId+" .ks-treeview-a");
			var _config = this.config;
			$node.die().live("click", function(e){
				var $this = $(this);
				var $parent = $this.parents(".ks-treeview-li");
				var $nodeTag = $this.children(".ks-treeview-node");
				var nodeId = $parent.attr("data-id");
				var parentId = $parent.attr("data-parent-id");
				var name = $parent.attr("data-title");
				var disable = $parent.attr("data-disable");
				if(disable == "true"){
					return false;
				}
				var nodeValue = {
					id : nodeId,
					parentId : parentId,
					name : name
				};
				$("#"+treeViewId+" .ks-treeview-node").removeClass("ks-treeview-select");
				$nodeTag.addClass("ks-treeview-select");
				_config.nodeCallback(nodeValue);
				e.stopPropagation();
			});
		},
		//获取禁止选择的checkbox列表
		_getDisableList : function(treeViewId, nodeId){
			return $("#"+treeViewId+" li[data-id='" + nodeId + "'] .ks-treeview-child .ks-treeview-a[class*='ks-treeview-disable'] .ks-treeview-check");
		},
		//获取checkbox列表
		_getList : function(treeViewId, nodeId, $disableCheckbox){
			return $("#"+treeViewId+" li[data-id='" + nodeId + "'] .ks-treeview-child .ks-treeview-check").not($disableCheckbox);
		},
		//选中一个或者多个节点
		_nodeCheckedEvent : function(){
			var $tree = this.$treeView;
			var treeViewId = $tree.attr("id");
			var $nodeCheck = $("#"+treeViewId+" .ks-treeview-check");
			var that = this;
			var _config = this.config;
			$nodeCheck.die().live("click", function(e){
				var $this = $(this);
				var $parent = $this.parents(".ks-treeview-li");
				var nodeId = $parent.attr("data-id");
				var parentId = $parent.attr("data-parent-id");
				var disable = $parent.attr("data-disable");
				var parent = $parent.children(".ks-treeview-child").length ? true : false;
				var $disableCheckbox = that._getDisableList(treeViewId, nodeId);
				var $checkbox = that._getList(treeViewId, nodeId, $disableCheckbox);
				if(disable == "true"){
					return false;
				}
				if(!$this.hasClass("ks-treeview-checked")){
					that._checked([$this]);
					if(parent){
						$checkbox.removeClass("ks-treeview-half-checked");
						$checkbox.addClass("ks-treeview-checked");
					}
					_config.checkedCallback();
				}
				else{
					that._unChecked([$this]);
					if(parent){
						$checkbox.removeClass("ks-treeview-half-checked");
						$checkbox.removeClass("ks-treeview-checked");
					}
					_config.unCheckedCallback();
				}
				that._searchParentNodes(parentId);
				e.stopPropagation();
			});
		},
		/**
		 * 选中节点
		 * @param Array $node 节点
		 */
		_checked : function($node){
			var nodeLength = $node.length;
			for(var i = 0; i < nodeLength; i++){
				$node[i].removeClass("ks-treeview-half-checked");
				$node[i].addClass("ks-treeview-checked");
			}
		},
		/**
		 * 撤销选中
		 * @param Array $node 节点
		 */
		_unChecked : function($node){
			var nodeLength = $node.length;
			for(var i = 0; i < nodeLength; i++){
				$node[i].removeClass("ks-treeview-half-checked");
				$node[i].removeClass("ks-treeview-checked");
			}
		},
		/**
		 * 设置半选
		 * @param Array $node 节点
		 */
		_halfChecked : function($node){
			var nodeLength = $node.length;
			for(var i = 0; i < nodeLength; i++){
				$node[i].removeClass("ks-treeview-checked");
				$node[i].addClass("ks-treeview-half-checked");
			}
		},
		//获取选中checkbox列表
		_getCheckedList : function(treeViewId, nodeId, $disableCheckbox){
			return $("#"+treeViewId+" li[data-id='" + nodeId + "'] .ks-treeview-child .ks-treeview-checked").not($disableCheckbox);
		},
		/**
		 * 查找父节点，并处理全选、反选、半选
		 * @param String parentId 父节点ID
		 */
		_searchParentNodes : function(parentId){
			var $tree = this.$treeView;
			var treeViewId = $tree.attr("id");
			var $parentNode = $("#"+treeViewId+" li[data-id='" + parentId + "']");
			if(!$parentNode.length){
				return false;
			}
			var $nodes = $parentNode;
			var $nodesCheck = $("#"+treeViewId+" li[data-id='" + parentId + "'] .ks-treeview-check").eq(0);
			var $disableCheckbox = this._getDisableList(treeViewId, parentId);
			var $checkList = this._getDisableList(treeViewId, parentId);
			var $checkedList = this._getCheckedList(treeViewId, parentId, $disableCheckbox);
			var nodesParentId = parseInt($nodes.attr("data-parent-id"));
			var checkListLen = $checkList.length;
			var checkedListLen = $checkedList.length;
			if((checkedListLen < checkListLen) && checkedListLen){
				this._halfChecked([$nodesCheck]);
			}
			else if(!checkedListLen){
				this._unChecked([$nodesCheck]);
			}
			else{
				this._checked([$nodesCheck]);
			}
			this._searchParentNodes(nodesParentId);
		},
		/**
		 * 展开指定节点
		 * @param Integer nodeId 当前节点ID
		 */
		_expandNode : function(nodeId){
			var $tree = this.$treeView;
			var treeViewId = $tree.attr("id");
			var $fold = $("#"+treeViewId+" .ks-treeview-li[data-id='" + nodeId + "'] .ks-treeview-a:eq(0) .ks-treeview-fold");
			var $icon = $("#"+treeViewId+" .ks-treeview-li[data-id='" + nodeId + "'] .ks-treeview-a:eq(0) .ks-treeview-icon");
			$fold.addClass("ks-treeview-fold-open");
			if($icon.hasClass("ks-treeview-picon")){
				$icon.addClass("ks-treeview-picon-open");
			}
			this._loadTree(nodeId, this.config.action.getChild, false);			
		},
		//展开所有节点
		expandAll : function(){
			var _config = this.config;
			_config.expandAll = true;
			this.isRoot = true;
			this._loadTree(this.defaultNodeId, _config.action.init, false);	
		},
		//切换树的状态
		toggle : function(display){
			var $tree = this.$treeView;
			var treeViewId = $tree.attr("id");
			var $fold = $tree.find(".ks-treeview-li:first .ks-treeview-fold:first");
			if(display == "show"){
				$fold.removeClass("ks-treeview-fold-open");
			}
			else if(display == "hide"){
				$fold.addClass("ks-treeview-fold-open");
			}
			this._expandEventFunc($fold, treeViewId, this.config);
		},
		/**
		 * 刷新树的某个节点
		 * @param Integer nodeId 节点ID
		 * @param String action 请求地址
		 */
		refreshNode : function(nodeId, action){
			var $tree = this.$treeView;
			var treeViewId = $tree.attr("id");
			var parentId = $("#"+treeViewId+" .ks-treeview-li[data-id='" + nodeId + "']").attr("data-parent-id");
			var $fold = $("#"+treeViewId+" .ks-treeview-li[data-id='" + nodeId + "'] .ks-treeview-a:eq(0) .ks-treeview-fold");
			var $checkbox = $("#"+treeViewId+" .ks-treeview-li[data-id='" + nodeId + "'] .ks-treeview-a:eq(0) .ks-treeview-check");
			if($fold.hasClass("ks-treeview-fold-open")){
				this.page = 1;
				this._loadTree(nodeId, action, false);
			}
			$checkbox.removeClass("ks-treeview-half-checked ks-treeview-checked");
			this._searchParentNodes(parentId);
		},
		//获取选中的节点
		getSelectNode : function(){
			var $tree = this.$treeView;
			var treeViewId = $tree.attr("id");
			var $selectNodes = $("#"+treeViewId+" .ks-treeview-node[class*='ks-treeview-select']");
			if(!$selectNodes.length){
				return null;
			}
			var $parent = $selectNodes.parents(".ks-treeview-li");
			var id = $parent.attr("data-id");
			var parentId = $parent.attr("data-parent-id");
			var name = $parent.attr("data-title");
			return {
				id : id,
				parentId : parentId,
				name : name
			}
		},
		//获取复选框选中的节点
		getCheckedNodes : function(){
			var $tree = this.$treeView;
			var treeViewId = $tree.attr("id");
			var $checkedNodes = $("#"+treeViewId+" .ks-treeview-checked");
			var nodesList = [];
			$checkedNodes.each(function() {
                var $this = $(this);
				var $parent = $this.parents(".ks-treeview-li");
				var id = $parent.attr("data-id");
				var parentId = $parent.attr("data-parent-id");
				var name = $parent.attr("data-title");
				nodesList.push({
					id : id,
					parentId : parentId,
					name : name
				});
            });
			return nodesList;
		},
		//销毁树目录
		destroy : function(){
			this.$treeView.remove();
			this.$treeView = null;
			return null;
		}
	};
	window.KTreeView = KTreeView;
})(jQuery);