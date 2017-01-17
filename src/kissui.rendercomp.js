/*
 * 快速创建组件(tootip、时间选择、单选按钮、复选框、选择器、开关)
 * author:张渊
 * modifyTime:2015-11-12
 */
Ks().package("K.Ui", function(Ks){
	this.RenderWidget = {
		/**
		 * 设置属性初始值
		 * @param String attrVal 属性值
		 * @param String defaultVal 默认值
		 */
		_setAttrVal : function(attrVal, defaultVal){
			return attrVal ? attrVal : defaultVal;
		},
        //禁用选择
		_disableSelect : function($selected){
			var tClassName = $selected.attr("class");
			if($.type(tClassName) != "undefined"){
				if(tClassName.indexOf("disable") != -1){
					return true;
				}
			}
			return false;
		},
		//快速创建tooltip
		renderTooltip : function(){
			var that = this;
			$("[type='ks-tooltip']").each(function() {
                var $this = $(this);
				var $eventObj = $($this.attr("data-event-obj"));
				var width = parseInt(that._setAttrVal($this.attr("data-width"), 200));
				var content = that._setAttrVal($this.attr("data-content"), "这里是气泡提示的内容");
				var location = that._setAttrVal($this.attr("data-location"), "top");
				var enable = that._setAttrVal($this.attr("data-dynamic-enable"), "false");
				var direction = that._setAttrVal($this.attr("data-dynamic-direction"), 1);
				var animate = that._setAttrVal($this.attr("data-animate"), "false");
				var offsetPx = parseInt(that._setAttrVal($this.attr("data-offset"), 0));
				enable = enable == "true" ? true : false;
				animate = animate == "true" ? true : false;
				var config = {
					$eventObj : $eventObj,
					width : width,
					content : content,
					location : location,
					dynamic : {
						enable : enable,
						direction : direction
					},
					animate : animate,
					offsetPx : offsetPx
				};
				return new K.Ui.Tootip(config);
            });
		},
		//快速创建下拉列表
		renderDropDown : function(){
			var that = this;
			$("div[type='ks-dropdown']").each(function() {
				var $this = $(this);
				var $targetObj = $($this.attr("data-target-obj"));
				var $layer = $($this.attr("data-layer"));
				var layerWidth = parseInt(that._setAttrVal($this.attr("data-width"), 240));
				var location = that._setAttrVal($this.attr("data-location"), "top");
				var show = that._setAttrVal($this.attr("data-show"), "false");
				var triggerMode = that._setAttrVal($this.attr("data-trigger-mode"), "mouseover");
				show = show == "true" ? true : false;
				var config = {
					$targetObj : $targetObj,
					$layer : $layer,
					layerWidth : layerWidth,
					location : location,
					show : show,
					triggerMode : triggerMode
				};
				return new K.Ui.DropDown(config);
			});
		},
		//快速创建表单组件
		renderFormComp : function(){
			this.renderDatePicker();
			this.renderRadio();
			this.renderCheckBox();
			this.renderSwitch();
		},
		renderDatePicker : function(){
			var that = this;
			$("div[type='ks-date-picker']").each(function() {
				var $this = $(this);
				var $input = $($this.attr("data-input"));
				var $eventObj = $($this.attr("data-event-obj"));
				var language = that._setAttrVal($this.attr("data-language"), "zh");
				var dateFormat = that._setAttrVal($this.attr("data-date-format"), "yyyy-mm-dd");
				var showTime = that._setAttrVal($this.attr("data-show-time"), "false");
				var minValue = that._setAttrVal($this.attr("data-min-year"), "1990");
				var maxValue = that._setAttrVal($this.attr("data-max-year"), "2090");
				showTime = showTime == "true" ? true : false;
				var config = {
					$input : $input,
					$eventObj : $eventObj,
					language : language,
					showTime : showTime,
					dateFormat : dateFormat,
					yearSetting : {
						minValue : minValue,
						maxValue : maxValue
					}
				};
				return new K.Ui.DatePicker(config);
			});
		},
		renderRadio : function(){
			var that = this;
			$(".ks-radio").each(function() {
				var radioName = $(this).attr("data-radio-name");
				var $radio = $(".ks-radio[data-radio-name='"+radioName+"'] a");
				$radio.off().on("click", function(){
					var $this = $(this);
					if(that._disableSelect($this)){
						return false;
					}
					$radio.removeClass("checked");
					$this.addClass("checked");
				});
            });
		},
		renderCheckBox : function(){
			var that = this;
			$(".ks-checkbox").each(function() {
				var radioName = $(this).attr("data-checkbox-name");
				var $checkbox = $(".ks-checkbox[data-checkbox-name='"+radioName+"'] a");
				$checkbox.off().on("click", function(){
					var $this = $(this);
					if(that._disableSelect($this)){
						return false;
					}
					if(!$this.hasClass("checked")){
						$this.addClass("checked");
					}
					else{
						$this.removeClass("checked");
					}
				});
            });
		},
		renderSwitch : function(){
			$(".ks-switch").off().on("click", function(){
				 var $this = $(this);
				 var $input = $this.children("input");
				 var styleName = $this.attr("data-style");
				 styleName = styleName.split("|");
				 var onStyle = styleName[0];
				 var offStyle = styleName[1];
				 var offTitle = "打开";
				 var onTitle = "关闭";
				 if($this.hasClass(onStyle)){
					$this.removeClass(onStyle);
				 	$this.addClass(offStyle);
					$this.attr("title", offTitle);
					$input.val(0);
				 }
				 else if($this.hasClass(offStyle)){
				    $this.removeClass(offStyle);
					$this.addClass(onStyle);
					$this.attr("title", onTitle);
					$input.val(1);
				 }
			});
		},
		getDatePickerValue : function(name){
			return $("div[type='ks-date-picker'] input[name='"+name+"']").val();
		},
		/**
		 * 获取选中单选按钮的值
		 * @param String radioName 单选按钮NAME
		 */
		getRadioValue : function(radioName){
			return $(".ks-radio[data-radio-name='"+radioName+"'] a[class='checked']").children("input").val();
		},
		/**
		 * 获取选中复选框的值
		 * @param String checkboxName 复选按钮NAME
		 */
		getCheckboxValue : function(checkboxName){
			var checkedValue = [];
			$(".ks-checkbox[data-checkbox-name='"+checkboxName+"'] a[class='checked']").each(function() {
                checkedValue.push($(this).children("input").val());
            });
			return checkedValue;
		},
		/**
		 * 获取开关的值
		 * @param String switchName 开关名称
		 */
		getSwitchValue : function(switchName){
			return $(".ks-switch input[name='"+switchName+"']").val();
		}
	};
});