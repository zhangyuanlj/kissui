/*
 * 日期时间选择器
 * author:张渊
 * modifyTime:2015-11-11
 */
Ks().package("K.Ui", function(Ks){
	this.DatePicker = function(config){
		this.$datePicker = null;
		this.config = {
			$input : $("input[name='date']"),
			$eventObj : $("#show-date-time"),
			init : {
				$parent : $("#parent"),
				disable : true
			},
			language : "zh",
			dateFormat : "yyyy-mm-dd",
			showTime : false,
			yearSetting : {
				minValue : 1990,
				maxValue : 2090
			},
			selectCallback : function(dateStr){
				return true;
			}
		};
		this._setConfig(config);
		this._init();
	};
	this.DatePicker.prototype = {
		_init : function(){
			var that = this;
			if(this.config.init.disable){
				$(this.config.$eventObj).on("mousedown", function(e){
					var $datePicker = $(".ks-date-picker");
					if($datePicker.length){
						$datePicker.remove();
					}
					that._render();
					that.$datePicker.addClass("ks-date-picker-pop");
					that._setPosition(that.config);
					that._flipDatePicker();
					that._createChangeMenu(that.config.yearSetting); 
					that._selectDate();
					if(that.config.showTime){
						that._createTimeMenu();
					}
					e.stopPropagation();
				});
				//点击空白区域关闭日期选择控件
				$(document).bind("mousedown", function(){
					var $datePicker = $(".ks-date-picker");
					if($datePicker.length){
						$datePicker.remove();
					}
				});
			}
			else{
				this._render();
				this._flipDatePicker();
				this._createChangeMenu(this.config.yearSetting); 
				this._selectDate();
				if(this.config.showTime){
					this._createTimeMenu();
				}
			}
		},
		_render : function(){
			var $body = $("body");
			var that = this;
			var _config = this.config;
			var date = new Date();
			var year = date.getFullYear();    
			var month = date.getMonth()+1;   
			var day = date.getDate();
			date.setDate(1);
			var firstDayWeek = date.getDay(); 
			var datePickerId = "datePicker-" + date.getTime();
			var datePickerTemp = '<div id="'+datePickerId+'" class="ks-date-picker">'
							   +	'<div class="ks-date-picker-hd">'
							   +	    '<a href="javascript:void(0);" class="prev"></a>'
						       +	   	'<a href="javascript:void(0);" class="next"></a>'
							   +		'<h4></h4>'
							   +	'</div>'
							   +    '<table border="0" cellspacing="0" cellpadding="0">'
							   +    '</table>'
							   +    '<div class="ks-date-picker-time">'
							   +	    '<strong><i></i>时间：</strong>'
							   +	    '<span class="hour"></span>'
							   +	    '<span>:</span>'
						       +	   	'<span class="minute"></span>'
							   +	    '<span>:</span>'
							   +		'<span class="seconds"></span>'
							   +    '</div>'
							   +    '<div id="'+datePickerId+'-year-popLayer" class="ks-poplayer ks-position-bottom">'
							   +			'<i class="ks-poplayer-arrow"></i>'
							   +			'<div class="ks-poplayer-content ks-date-picker-change"></div>'
							   +	 '</div>'
							   +    '<div id="'+datePickerId+'-month-popLayer" class="ks-poplayer ks-position-bottom">'
							   +			'<i class="ks-poplayer-arrow"></i>'
							   +			'<div class="ks-poplayer-content ks-date-picker-change"></div>'
							   +	 '</div>'
							   +    '<div id="'+datePickerId+'-hour-popLayer" class="ks-poplayer ks-position-top">'
							   +			'<i class="ks-poplayer-arrow"></i>'
							   +			'<div class="ks-poplayer-content ks-date-picker-change"></div>'
							   +	 '</div>'
							   +    '<div id="'+datePickerId+'-minute-popLayer" class="ks-poplayer ks-position-top">'
							   +			'<i class="ks-poplayer-arrow"></i>'
							   +			'<div class="ks-poplayer-content ks-date-picker-change"></div>'
							   +	 '</div>'
							   +    '<div id="'+datePickerId+'-seconds-popLayer" class="ks-poplayer ks-position-top">'
							   +			'<i class="ks-poplayer-arrow"></i>'
							   +			'<div class="ks-poplayer-content ks-date-picker-change"></div>'
							   +	 '</div>'
							   +  '</div>';
			this.currentYear = year;
			this.currentMonth = month;
			this.currentDay = day;
			if(_config.init.disable){
				$body.append(datePickerTemp);
			}
			else{
				_config.init.$parent.html(datePickerTemp);
			}
			this.$datePicker = $("#"+datePickerId);
			this.Calendar = new K.Calendar();
			if(_config.showTime){
				var hour = date.getHours().toString();  
				var minute = date.getMinutes().toString();
				var second = date.getSeconds().toString();
				hour = hour.length < 2 ? "0"+hour : hour;
				minute = minute.length < 2 ? "0"+minute : minute;
				second = second.length < 2 ? "0"+second : second;
				this.currentHour = hour;
				this.currentMinute = minute;
				this.currentSecond = second;
				this.$datePicker.children(".ks-date-picker-time").show();
			}
			this._create(year, month, day, firstDayWeek);  
		},
		/**
		 * 创建日历
		 * @param Integer year 当前年份
		 * @param Integer month 当前月份
		 * @param Integer day 当前月份中的某一天
		 * @param Integer firstDayWeek 返回本月第一天是星期几
		 */
		_create : function(year, month, day, firstDayWeek){
			var currentYear = year;
			var currentMonth = month;
			var currentDay = day;
			var prevYear = currentMonth == 1 ? currentYear-1 : currentYear;
			var prevMonth = month == 1 ? 12 : month-1;
			var nextYear = currentMonth == 12 ? currentYear+1 : currentYear;
			var nextMonth = currentMonth == 12 ? 1 : currentMonth+1;
			var prevMonthDays = currentMonth != 1 ? this.Calendar.getMonthDays(prevYear, prevMonth) : this.Calendar.getMonthDays(prevYear, prevMonth);
			var currentMonthDays = this.Calendar.getMonthDays(currentYear, currentMonth);
			var nextMonthFirstDay = 1;
			var converDayWeek = [6, 0, 1, 2, 3, 4, 5];
			var dateHtml = [];
			var dateNum = 0;
			var dateTotal = 42;
			var language = {
				"zh" : [
						["年", "日"],
						["一", "二", "三", "四", "五", "六", "日"]
				],
				"en" : [
						["-", ""],
						["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
				]
			};
			var _config = this.config;
			var _configLan = _config.language;
			var titleStr = '<strong class="current-year">'+currentYear
						 +language[_configLan][0][0]+'</strong><strong class="current-month">'
						 + currentMonth+language[_configLan][0][1]+'</strong>';
			this.$datePicker.children(".ks-date-picker-hd").find("h4").html(titleStr);
			dateHtml.push('<tr>');
			$(language[_configLan][1]).each(function(index) {
                dateHtml.push('<th>'+language[_configLan][1][index]+'</th>');
            });
			dateHtml.push('</tr>');
			for(var i = 0; i < 6; i++){
				dateHtml.push('<tr>');
				for(var j = 0; j < 7; j++){
					if(dateNum < converDayWeek[firstDayWeek]){
						var _prevMonthDay = prevMonthDays-converDayWeek[firstDayWeek]+dateNum+1; 
						var dateStr = this._dateFormat(prevYear, prevMonth, _prevMonthDay);
						dateHtml.push('<td><a href="javascript:void(0);" class="prev-month" data-date="'+dateStr+'">'+_prevMonthDay+'</a></td>');
					}
					else if(dateNum >= converDayWeek[firstDayWeek] && dateNum < converDayWeek[firstDayWeek]+currentMonthDays){
						var _currentMonthDay = dateNum-converDayWeek[firstDayWeek]+1; 
						var dateStr = this._dateFormat(currentYear, currentMonth, _currentMonthDay);
						var styleName = this.currentDay == _currentMonthDay && currentDay ? "today" : "";
						dateHtml.push('<td><a href="javascript:void(0);" class="'+styleName+'" data-date="'+dateStr+'">'+_currentMonthDay+'</a></td>');
					}
					else{
						var dateStr = this._dateFormat(nextYear, nextMonth, nextMonthFirstDay);
						dateHtml.push('<td><a href="javascript:void(0);" class="next-month" data-date="'+dateStr+'">'+nextMonthFirstDay+'</a></td>');
						nextMonthFirstDay++;
					}
					dateNum++;
				}
				dateHtml.push('</tr>');
			}
			this.$datePicker.children("table").html(dateHtml.join("\n"));
			this.$datePicker.children(".ks-date-picker-time").find(".hour").text(this.currentHour);
			this.$datePicker.children(".ks-date-picker-time").find(".minute").text(this.currentMinute);
			this.$datePicker.children(".ks-date-picker-time").find(".seconds").text(this.currentSecond);
		},
		/**
		 * 创建设置菜单，并绑定事件
		 * @param Object yearSetting 年份配置
		 */
		_createChangeMenu : function(yearSetting){
			var $document = $(document);
			var that = this;
			var datePickerId = this.$datePicker.attr("id");
			var $changePop = $("#"+datePickerId+" .ks-poplayer");
			var $yearPop = $("#"+datePickerId+"-year-popLayer");
			var $monthPop = $("#"+datePickerId+"-month-popLayer");
			var yearBtn = "#"+datePickerId+" .ks-date-picker-hd .current-year";
			var monthBtn = "#"+datePickerId+" .ks-date-picker-hd .current-month";
			var yearItems = [];
			var monthItems = [];
			for(var i = yearSetting.minValue; i <= yearSetting.maxValue; i++){
				yearItems.push('<a href="javascript:void(0);">'+i+'</a>');
			}
			for(var j = 1; j <= 12; j++){
				monthItems.push('<a href="javascript:void(0);">'+j+'</a>');
			}
			$yearPop.children(".ks-poplayer-content").width(90).html(yearItems.join("\n"));
			$monthPop.children(".ks-poplayer-content").width(60).html(monthItems.join("\n"));
			//打开切换年份列表
			$document.off(yearBtn).on("mousedown", yearBtn, function(e){
				var $year = $(this);
				var display = $yearPop.css("display");
				$yearPop.css({
					left : $year.position().left/2,
					top : $year.position().top+$year.outerHeight(true)+10
				});
				$changePop.hide();
				if(display == "none"){
					$yearPop.show();
				}
				else{
					$yearPop.hide();
				}
				e.stopPropagation();
				return false;
			});
			//打开切换月份列表
			$document.off(monthBtn).on("mousedown", monthBtn, function(e){
				var $month = $(this);
				var display = $monthPop.css("display");
				$monthPop.css({
					left : $month.position().left/2+30,
					top : $month.position().top+$month.outerHeight(true)+10
				});
				$changePop.hide();
				if(display == "none"){
					$monthPop.show();
				}
				else{
					$monthPop.hide();
				}
				e.stopPropagation();
				return false;
			});
			//切换年份
			$("#"+datePickerId+"-year-popLayer a").on("mousedown", function(e){
				var selectDate = that._getChangeDate();
				var year = parseInt($(this).text());
				var month = selectDate.month;
				that._updateDatePicker(year, month);
				$changePop.hide();
				e.stopPropagation();
			});
			//切换月份
			$("#"+datePickerId+"-month-popLayer a").on("mousedown", function(e){
				var selectDate = that._getChangeDate();
				var year = selectDate.year;
				var month = parseInt($(this).text());
				that._updateDatePicker(year, month);
				$changePop.hide();
				e.stopPropagation();
			});
			$changePop.on("mousedown", function(e){
				e.stopPropagation();
			});
		},
		//创建时间设置菜单
		_createTimeMenu : function(){
			var that = this;
			var datePickerId = this.$datePicker.attr("id");
			var $changePop = $("#"+datePickerId+" .ks-poplayer");
			var $hourPop = $("#"+datePickerId+"-hour-popLayer");
			var $minutePop = $("#"+datePickerId+"-minute-popLayer");
			var $secondsPop = $("#"+datePickerId+"-seconds-popLayer");
			var hourItems = [];
			var minuteItems = [];
			var secondsItems = [];
			var offsetLeft = 3;
			for(var i = 0; i <= 23; i++){
				var str = i.toString().length < 2 ? "0"+i : i;
				hourItems.push('<a href="javascript:void(0);">'+str+'</a>');
			}
			for(var j = 0; j <= 59; j++){
				var str = j.toString().length < 2 ? "0"+j : j;
				minuteItems.push('<a href="javascript:void(0);">'+str+'</a>');
				secondsItems.push('<a href="javascript:void(0);">'+str+'</a>');
			}
			$hourPop.children(".ks-poplayer-content").width(60).html(hourItems.join("\n"));
			$minutePop.children(".ks-poplayer-content").width(60).html(minuteItems.join("\n"));
			$secondsPop.children(".ks-poplayer-content").width(60).html(secondsItems.join("\n"));
			//打开切换小时列表
			$("#"+datePickerId+" .ks-date-picker-time .hour").on("mousedown", function(e){
				var $hour = $(this);
				var display = $hourPop.css("display");
				$hourPop.css({
					left : $hour.position().left-$hourPop.width()/2+offsetLeft,
					top : $hour.position().top-$hourPop.outerHeight(true)-10
				});
				$changePop.hide();
				if(display == "none"){
					$hourPop.show();
				}
				else{
					$hourPop.hide();
				}
				e.stopPropagation();
				return false;
			});
			//打开切换分钟列表
			$("#"+datePickerId+" .ks-date-picker-time .minute").on("mousedown", function(e){
				var $minute = $(this);
				var display = $minutePop.css("display");
				$minutePop.css({
					left : $minute.position().left-$minutePop.width()/2+offsetLeft,
					top : $minute.position().top-$minutePop.outerHeight(true)-10
				});
				$changePop.hide();
				if(display == "none"){
					$minutePop.show();
				}
				else{
					$minutePop.hide();
				}
				e.stopPropagation();
				return false;
			});
			//打开切换秒数列表
			$("#"+datePickerId+" .ks-date-picker-time .seconds").on("mousedown", function(e){
				var $seconds = $(this);
				var display = $secondsPop.css("display");
				$secondsPop.css({
					left : $seconds.position().left-$secondsPop.width()/2+offsetLeft,
					top : $seconds.position().top-$secondsPop.outerHeight(true)-10
				});
				$changePop.hide();
				if(display == "none"){
					$secondsPop.show();
				}
				else{
					$secondsPop.hide();
				}
				e.stopPropagation();
				return false;
			});
			//切换小时
			$("#"+datePickerId+"-hour-popLayer a").on("mousedown", function(e){
				var hour = $(this).text();
				$("#"+datePickerId+" .ks-date-picker-time .hour").text(hour);
				$changePop.hide();
				e.stopPropagation();
			});
			//切换分钟
			$("#"+datePickerId+"-minute-popLayer a").on("mousedown", function(e){
				var minute = $(this).text();
				$("#"+datePickerId+" .ks-date-picker-time .minute").text(minute);
				$changePop.hide();
				e.stopPropagation();
			});
			//切换秒数
			$("#"+datePickerId+"-seconds-popLayer a").on("mousedown", function(e){
				var seconds = $(this).text();
				$("#"+datePickerId+" .ks-date-picker-time .seconds").text(seconds);
				$changePop.hide();
				e.stopPropagation();
			});
		},
		/**
		 * 设置日历控件位置
		 * @param Object config 配置项
		 */
		_setPosition : function(config){
			var that = this;
			var $document = $(document);
			var $window = $(window);
			var $input = config.$input;
			var docHeight = $document.height();
			var windowHeight = $window.height();
			var inputTop = $input.position().top;
			var inputHeight = $input.outerHeight(true);
			var datePickerHeight = this.$datePicker.height();
			var bottomHeight = docHeight <= windowHeight ? windowHeight+$window.scrollTop()-inputTop-inputHeight : docHeight-inputTop-inputHeight;
			var left = $input.position().left-1;
			var top = 0;
			if(bottomHeight <= datePickerHeight){
				top = inputTop-datePickerHeight;
			}
			if(bottomHeight > datePickerHeight || inputTop < datePickerHeight){
				top = inputTop+inputHeight;
			}
			this.$datePicker.css({
				left : left, 
				top : top
			});
			//修正窗口大小改变时，日期选择器位置
			$window.resize(function(){
				if($(".ks-date-picker").length){
					var left = $input.position().left-1;
					that.$datePicker.css("left" , left);
				}
			});
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
		/**
		 * 格式化日期
		 * @param Integer year 年份
		 * @param Integer month 月份
		 * @param Integer day 当前月份中的某一天
		 */
		_dateFormat : function(year, month, day){
			var dateStr = [year.toString(), month.toString(), day.toString()];
			if(dateStr[1].length < 2){
				dateStr[1] = "0"+ dateStr[1];
			}
			if(dateStr[2].length < 2){
				dateStr[2] = "0"+ dateStr[2];
			}
			if(this.config.dateFormat == "yyyy-mm-dd"){
				return dateStr.join("-");
			}
			else if(this.config.dateFormat == "yyyy/mm/dd"){
				return dateStr.join("/");
			}
		},
		//选择日期
		_selectDate : function(){
			var that = this;
			var datePickerId = this.$datePicker.attr("id");
			$("#"+datePickerId+" table td a").on("mousedown", function(e){
				var $this = $(this);
				var $dateItem = $("#"+datePickerId+" table td a[class!='today']");
				var dateStr = $this.attr("data-date");
				if(that.config.showTime){
					var time = that._getChangeTime();
					var hour = time.hour;
					var minute = time.minute;
					var seconds = time.seconds;
					dateStr += " "+hour+":"+minute+":"+seconds;
				}
				if(that.config.init.disable){
					$(that.config.$input).val(dateStr);
					that.$datePicker.remove();
				}
				else{
					$this.addClass("active");
					$dateItem.not($this).removeClass("active");
				}
				if(that.config.selectCallback){
					that.config.selectCallback(dateStr);
				}
				e.stopPropagation();
			});
		},
		/**
		 * 更新日历
		 * @param Integer newYear 年份
		 * @param Integer newMonth 年份
		 */
		_updateDatePicker : function(newYear, newMonth){
			var date = new Date(newYear, newMonth-1);
			var day = newYear == this.currentYear && newMonth == this.currentMonth ? this.currentDay : 0;
			date.setDate(1);
			var firstDayWeek = date.getDay(); 
			this._create(newYear, newMonth, day, firstDayWeek);   
		},
		//通过上下箭头更新日历
		_flipDatePicker : function(){
			var that = this;
			var datePickerId = this.$datePicker.attr("id");
			var $changePop = $("#"+datePickerId+" .ks-poplayer");
			$("#"+datePickerId+" .ks-date-picker-hd .prev").on("mousedown", function(e){
				var selectDate = that._getChangeDate();
				var year = selectDate.year;
				var month = selectDate.month;
				month--;
				if(month < 1){
					year--;
					month = 12;
				}
				$changePop.hide();
				that._updateDatePicker(year, month);
				e.stopPropagation();
			});
			$("#"+datePickerId+" .ks-date-picker-hd .next").on("mousedown", function(e){
				var selectDate = that._getChangeDate();
				var year = selectDate.year;
				var month = selectDate.month;
				month++;
				if(month > 12){
					year++;
					month = 1;
				}
				$changePop.hide();
				that._updateDatePicker(year, month);
				e.stopPropagation();
			});
		},
		//获取通过下拉列表切换后的日期
		_getChangeDate : function(){
			var year = parseInt(this.$datePicker.children(".ks-date-picker-hd").find(".current-year").text());
			var month = parseInt(this.$datePicker.children(".ks-date-picker-hd").find(".current-month").text());
			return {
				year : year,
				month : month
			};
		},
		//获取通过下拉列表切换后的时间
		_getChangeTime : function(){
			var hour = this.$datePicker.children(".ks-date-picker-time").find(".hour").text();
			var minute = this.$datePicker.children(".ks-date-picker-time").find(".minute").text();
			var seconds = this.$datePicker.children(".ks-date-picker-time").find(".seconds").text();
			return {
				hour : hour,
				minute : minute,
				seconds : seconds
			};
		},
		//获取系统日期时间
		getCurrentDateTime : function(){
			return {
				year : this.currentYear,
				month : this.currentMonth,
				day : this.currentDay,
				hour : this.currentHour,
				minute : this.currentMinute,
				seconds : this.currentSecond
			};
		},
		//销毁日期时间选择器
		destroy : function(){
			this.$datePicker.remove();
			return null;
		}
	};
});