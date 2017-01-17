/*
 * 表单组合框组件
 * author:张渊
 * modifyTime:2015-11-9
 */
Ks().package("K.Ui", function(Ks){
	this.ComboBox = function(config){
		this.$comboBox = null;
		this.config = {
			$parent : $("#combo-wrapper"),
			width : 300,
			align : "left",
			render : 1, 
			selectId : "#select",
			disable : false,
			data : [
				{
					value : "Javascript",
					text : "Javascript"
				},
				{
					value : "HTML+CSS",
					text : "HTML+CSS"
				},
				{
					value : "PHP",
					text : "PHP"
				},
				{
					value : "JAVA",
					text : "JAVA"
				}
			],
			changeFunc : function(value, text){
				return true;
			}
		};
		this._setConfig(config);
		this._init();
	};
	this.ComboBox.prototype = {
		_init : function(){
			this._create();
			if(!this.config.disable){
				this._bindComboEvent();
			}
		},
		_create : function(){
			var date = new Date();
			var comboId = "combo-" + date.getTime();
			var comboTemp = '<div id="'+comboId+'" class="ks-select-box">'
							 +		'<div class="ks-select">'	
							 +          '<div class="ks-select-title">'
							 +		         '<div class="ks-select-arrow" onselectstart="return false;">'
							 +			          '<i class="off"></i>'
							 +		          '</div>'
							 +                '<h4 onselectstart="return false;"></h4>'
							 +          '</div>'
							 +          '<ul>'
							 +          '</ul>'
							 +		'</div>'
							 +	'</div>';
			this._renderComboList(comboId, comboTemp);
		},
		/**
		 * 根据静态数据或者下拉菜单渲染组合框
		 * @param Integer comboId 组合框Id
		 * @param String comboTemp 组合框模板
		 */
		_renderComboList : function(comboId, comboTemp){
			var comboList = [];
			var currentCombo = {};
			var align = "lf";
			var _config = this.config;
			var _data = _config.data;
			if(_config.render == 1){
				$(_config.data).each(function(index) {
					if(!index){
						currentCombo.value = _data[index].value;
						currentCombo.text = _data[index].text;
					}
					comboList.push('<li><a href="javascript:void(0);" data-value="'+_data[index].value+'">'+_data[index].text+'</a></li>');
				});	
			}
			else if(_config.render == 2){
				$(_config.selectId+" option").each(function(index) {
					var $this = $(this);
					if(!index){
						currentCombo.value = $this.attr("value");
						currentCombo.text = $this.text();
					}
					comboList.push('<li><a href="javascript:void(0);" data-value="'+$this.attr("value")+'">'+$this.text()+'</a></li>');
				});
			}
			_config.$parent.html(comboTemp+'<input type="hidden" id="'+comboId+'-selected" />');
			this.$comboBox = $("#"+comboId);
			this.$comboBox.width(_config.width-2);
			if(_config.disable){
				this.$comboBox.addClass("ks-form-disable");
			}
			$("#"+comboId+"-selected").val(currentCombo.value);
			if(_config.align == "left"){
				align = "ks-text-lf";
			}
			else if(_config.align == "center"){
				align = "ks-text-cen";
			}
			else if(_config.align == "right"){
				align = "ks-text-rg";
			}
			$("#"+comboId+" .ks-select-title h4").addClass(align).attr("data-value", currentCombo.value).html(currentCombo.text);
			$("#"+comboId+" ul").css({
				width : _config.width-2,
				left : _config.$parent.position().left,
				top : _config.$parent.position().top+_config.$parent.outerHeight(true)
			}).html(comboList.join("\n"));
			this._setComboListHeight();
		},
		//设置组合框弹出列表高度
		_setComboListHeight : function(){
			var comboId = this.$comboBox.attr("id");
			var comboListHeight = 210;
			if($("#"+comboId+" li").length >= 10){
				$("#"+comboId+" ul").height(comboListHeight);
			}
		},
		//设置组合框样式
		_setComboBoxStyle : function(display){
			if(display == "none"){
				this.$comboBox.css({
					"border-bottom-left-radius" : 0,
					"border-bottom-right-radius" : 0
				});
			}
			else{
				this.$comboBox.css({
					"border-bottom-left-radius" : "5px",
					"border-bottom-right-radius" : "5px"
				});
			}
		},
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
		//给下拉列表组件绑定事件
		_bindComboEvent : function(){
			var that = this;
			var comboId = this.$comboBox.attr("id");
			//打开关闭组合框
			$("#"+comboId+" .ks-select-title").on("mousedown", function(e){
				if(e.which != 1){
					return false;
				}
				var $thisComboItem = that.$comboBox.children().find("ul");
				var $arrow = that.$comboBox.children().find(".ks-select-arrow i");
				var $comboItem = $(".ks-select-box").children().find("ul");
				var display = $thisComboItem.css("display");
				if(display == "none"){
					$comboItem.hide();
					$thisComboItem.show();
					//修正窗口大小改变时，弹出列表位置
					$thisComboItem.css("left" , that.config.$parent.position().left);
					$arrow.attr("class", "on");
				}
				else{
					$thisComboItem.hide();
					$arrow.attr("class", "off");
				}
				that._setComboBoxStyle(display);
				e.stopPropagation();
			});
			//点击组合框列表，并赋值
			$("#"+comboId+" ul a").on("mousedown", function(e){
				if(e.which != 1){
					return false;
				}
				var $this = $(this);
				var $arrow = that.$comboBox.children("").find(".ks-select-arrow i");
				var value = $this.attr("data-value");
				var text = $this.text();
				$("#"+comboId+" .ks-select-title h4").attr("data-value", value).html(text);
				$("#"+comboId+"-selected").val(value);
				$arrow.attr("class", "off");
				that.$comboBox.children().find("ul").hide();
				if(that.config.changeFunc){
					that.config.changeFunc(value, text);
				}
				that._setComboBoxStyle("block");
			});
			$("#"+comboId+" ul").on("mousedown", function(e){
				e.stopPropagation();
			});
			//点击空白区域关闭组合框
			$(document).bind("mousedown", function(){
				if($(".ks-select-box").length){
					var $arrow = that.$comboBox.children("").find(".ks-select-arrow i");
					$arrow.attr("class", "off");
					$(".ks-select-box").children().find("ul").hide();
					that._setComboBoxStyle("block");
				}
			});
			//修正窗口大小改变时，弹出列表位置
			$(window).resize(function(){
				if($(".ks-select-box").length){
					that.$comboBox.children().find("ul").css("left" , that.config.$parent.position().left);
				}
			});
		},
		//获取组合框的值
		getValue : function(){
			return $("#"+this.$comboBox.attr("id")+"-selected").val();
		},
		//获取组合框的索引
		getSelectIndex : function(){
			var value = this.getValue();
			return $("#"+this.$comboBox.attr("id")+" ul a[data-value='"+value+"']").parent("li").index();
		},
		/**
		 * 添加一个组合框选项
		 * @param Object data 添加的值 {value : "Javascript", text : "Javascript"}
		 */
		addItem : function(data){
			$("#"+this.$comboBox.attr("id")+" ul").append('<li><a href="javascript:void(0);" data-value="'+data.value+'">'+data.text+'</a></li>');
			this._setComboListHeight();
		}
	};
});