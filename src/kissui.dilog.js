/*
 * 对话框
 * author:张渊
 * modifyTime:2015-12-9
 */
Ks().package("K.Ui", function(Ks){
	this.Dilog = function(config){
		this.$dilog = null;
		this.config = {
			$parent : $("body"),                   
			width : 498,       
			position : 7,
			styleName : "ks-dilog",
			isConDilog : true,
			title :　{
				show : true,
				text : "页面对话框"
			},				  
			content : {
				loadType : 1,
				text : "页面对话框内容",
				loadUrl : ""
			},                      
			modal : true,
			btn : {
				show : true,
				align : "center",
				items : [{
					text : "确定",
					btnStyle : "blue",
					callback : function(Dilog, $btn){
						return true;
					}
				},
				{
					text : "取消",
					btnStyle : "gray",
					callback : function(Dilog, $btn){
						return true;
					}
				}]
			}
		};
		this._setConfig(config);
		if(this.config.isConDilog){
			this._init();
		}
	};
	this.Dilog.prototype = {
		_init : function(){
			this._createDiog();
		},
		_createDiog : function(){
			var isTop = window == top;
			var $document = isTop ? $(document) : $(window.parent.document);
			var $window = isTop ? $(window) : $(window.parent);
			var that = this;
			var _config = this.config;
			var date = new Date();
			var dilogId = "dilog-" + date.getTime();
			var maskTemp = '<div id="'+dilogId+'-mask" class="ks-mask"></div>';
			var dilogTemp = '<div id="'+dilogId+'" class="'+_config.styleName+'"></div>';
			var dilogTitleTemp = '<div class="ks-dilog-title">'
										+'<a href="javascript:void(0);" title="关闭对话框"></a>'
        								+'<h4></h4>'
								  +'</div>';
			var dilogConTemp = '<div class="ks-dilog-content"></div>';
			var dilogBtnTemp = '<div class="ks-dilog-btn"></div>';		
			var _$parent = _config.$parent;
			if(_config.modal){
				var maskHeight = $window.height() < $document.height() ? $document.height() : $window.height();
				_$parent.append(maskTemp);
				$("#"+dilogId+"-mask", _$parent).css({
					opacity : 0.3,
					height : maskHeight
				});
			}
			_$parent.append(dilogTemp);
			this.$dilog =  $("#"+dilogId, _$parent);
			var _$dilog = this.$dilog;
			_$dilog.width(_config.width);
			if(_config.title.show){
				_$dilog.append(dilogTitleTemp);
				_$dilog.children().find("h4").html(_config.title.text);
				$("#"+dilogId+" .ks-dilog-title a", this.config.$parent).on("mousedown", function(e){
					that.destroy();
					e.stopPropagation();
				});
			}
			_$dilog.append(dilogConTemp);
			this.setContent(_config.content, _config.position);
			if(_config.btn.show){
				var align = _config.btn.align;
				var styleName = "ks-dilog-btn-ac";
				var btnItems = _config.btn.items;
				var btnItemsLength = btnItems.length;
				var btnCallback = {};
				if(align == "left"){
					styleName = "ks-dilog-btn-al";
				}
				else if(align == "center"){
					styleName = "ks-dilog-btn-ac";
				}
				else if(align == "right"){
					styleName = "ks-dilog-btn-ar";
				}
				_$dilog.append(dilogBtnTemp);
				var _$dilogBtn = _$dilog.children(".ks-dilog-btn");
				_$dilogBtn.addClass(styleName);
				for(var i = 0; i < btnItemsLength; i++){
					var btnOption = btnItems[i];
					var id = dilogId+"-btn"+(i+1);
					var text = btnOption.text;
					var btnStyle = btnOption.btnStyle == "blue" ? "ks-dilog-blue-btn" : "ks-dilog-gray-btn";
					_$dilogBtn.append('<input type="button" id="'+id+'" class="'+btnStyle+'" value="'+text+'">\n');
					btnCallback[id] = btnOption.callback;
				}
				this._btnBindCallback(btnCallback);
			}
			this.setPosition(_config.position);
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
		 * 给配置的按钮绑定事件
		 * @param Object btnCallback 按钮回调函数
		 */
		_btnBindCallback : function(btnCallback){
			if(!btnCallback){
				return false;
			}
			var that = this;
			var dilogId = this.$dilog.attr("id");
			$("#"+dilogId+" .ks-dilog-btn input", this.config.$parent).on("mousedown", function(e){
				var $this = $(this);
				var id = $this.attr("id");
				btnCallback[id](that, $this);
				e.stopPropagation();
			});
		},
		//获取对话框ID
		getDilogId : function(){
			return this.$dilog.attr("id");
		},
		/**
		 * 设置对话框位置
		 * @param Integer position 位置
		 * 1 3 5
		 *   7
		 * 2 4 6
		 * @param Object value 自定义位置值{left:130,top:240}
		 */
		setPosition : function(position, value){
			var isTop = window == top;
			var $window = isTop ? $(window) : $(window.parent);
			var winWidth = $window.width();
			var winHeight = $window.height();
			var winScrollTop = $window.scrollTop();
			var dilogWidth = this.$dilog.width();
			var dilogHeight = this.$dilog.height();
			switch(position){
				case 1 : this.$dilog.css({
						  	  left : 0,
							  top : winScrollTop
						  });
						  break;
				case 2 : this.$dilog.css({
						  	  left : 0,
							  bottom : 0
						  });
						  break;
				case 3 : this.$dilog.css({
						  	  left : winWidth/2-dilogWidth/2,
							  top : winScrollTop
						  }); 
						 break;
				case 4 : this.$dilog.css({
						  	  left : winWidth/2-dilogWidth/2,
							  bottom : 0
						  });  
						 break;
				case 5 : this.$dilog.css({
						  	  right : 0,
							  top : winScrollTop
						  }); 
						  break;
				case 6 : this.$dilog.css({
						  	  right : 0,
							  bottom : 0
						  }); 
						  break;
				case 7 :  this.$dilog.css({
						  	  left : winWidth/2-dilogWidth/2,
							  top : winHeight/2-dilogHeight/2+winScrollTop
						  }); 
						  break;
				case 8 :  this.$dilog.css({
						  	  left : value.left,
							  top : value.top
						  }); 
						  break;
				default : break;
			}
		},
		/**
		 * 设置对话框内容
		 * @param Object content 对话框内容配置参数
		 * @param Integer position 如果是异步加载必须设置位置参数
		 */
		setContent : function(content, position){
			var that = this;
			var _$dilogCon = this.$dilog.children(".ks-dilog-content");
			if(content.loadType == 1){
				_$dilogCon.html(content.text);
			}
			else{
				_$dilogCon.addClass("ks-dilog-content-loading");
				_$dilogCon.load(content.loadUrl, function(){
					$(this).removeClass("ks-dilog-content-loading");
					that.setPosition(position);
				});
			}
		},
		/**
		 * 创建警告对话框
		 * @param Integer width 对话框宽度
		 * @param String title 对话框标题
		 * @param String content 对话框内容
		 */
		createAlert : function(width, title, content){
			var isTop = window == top;
			var $parent = isTop ? $("body") : $("body", window.parent.document);
			this.config.$parent = $parent;
			this.config.width = width; 
			this.config.title.text = title;
			this.config.content.text = "<i></i><p>"+content+"</p>";
			this.config.btn = {
				show : true,
				align : "center",
				items : [{
					text : "确定",
					btnStyle : "blue",
					callback : function(Dilog){
						Dilog.destroy();
						return true;
					}
				}]
		    };
			this._createDiog();
			this.$dilog.children(".ks-dilog-content").addClass("ks-dilog-alert");
		},
		/**
		 * 创建确认对话框
		 * @param Integer width 对话框宽度
		 * @param String title 对话框标题
		 * @param String content 对话框内容
		 * @param Fuction callback 点击确定按钮之后的回调函数
		 */
		createConfirm : function(width, title, content, callback){
			var isTop = window == top;
			var $parent = isTop ? $("body") : $("body", window.parent.document);
			this.config.$parent = $parent;
			this.config.width = width; 
			this.config.title.text = title;
			this.config.content.text = "<i></i><p>"+content+"</p>";
			this.config.btn = {
				show : true,
				align : "center",
				items : [{
					text : "确定",
					btnStyle : "blue",
					callback : function(Dilog, $btn){
						if(callback){
							callback(Dilog, $btn);
						}
						return true;
					}
				},
				{
					text : "取消",
					btnStyle : "gray",
					callback : function(Dilog){
						Dilog.destroy();
						return true;
					}
				}]
		    };
			this._createDiog();
			this.$dilog.children(".ks-dilog-content").addClass("ks-dilog-confirm");
		},
		/**
		 * 获取对话框中表单字段的值
		 * @param return value 表单字段的值
		 */
		getValue : function(){
			var $dilog = this.$dilog;
			var $ifame = $dilog.children(".ks-dilog-content").find("iframe");
			var $form = $dilog.children(".ks-dilog-content");
			var value = {};
			if($ifame.length){
				$form = $ifame.contents();
			}
			var $radio = $form.find(".ks-radio");
			var $checkbox = $form.find(".ks-checkbox");
			var $select = $form.find(".ks-select-box");
			var $file = $form.find(".ks-upload-file-item");
			//文本框
			$form.find("input").each(function(){
				var $this = $(this);
				var name = $this.attr("name");
				var type = $this.attr("type");
				if(type == "radio" || type == "checkbox"){
					return true;
				}
				if($this.attr("name")){
					value[name] = $this.val();
				}
			});
			//文本区域
			$form.find("textarea").each(function(){
				var $this = $(this);
				value[$this.attr("name")] = $this.val();
			});
			//下拉菜单
			$form.find("select").each(function(){
				var $this = $(this);
				value[$this.attr("name")] = $this.val();
			});
			if($select.length){
				$select.each(function(index){
					var $this = $(this);
					var $title = $this.find(".ks-select-title h4");
					value[$this.parent("div").data("name")] = {
						text : $title.text(),
						value : $title.data("value")
					};
				});
			}
			//单选按钮
			if($radio.length){
				$radio.each(function(){
					var $this = $(this);
					var name = $this.data("radio-name");
					value[name] = $this.find("a[class='checked'] input").val();
				});
			}
			//复选框
			if($checkbox.length){
				$checkbox.each(function(){
					var $this = $(this);
					var name = $this.data("checkbox-name");
					var checkedVal = [];
					$this.children("a").each(function(){
						var _$this = $(this);
						if(_$this.hasClass("checked")){
							checkedVal.push(_$this.children("input").val());
						}
					});
					value[name] = checkedVal;
				});
			}
			//上传
			if($file.length){
				var fileData = [];
				$file.each(function(){
					fileData.push($(this).attr("data-response"));
				});
				value[$file.parent("div").data("name")] = '{"data":['+fileData.join(",")+']}';
			}
			return value;
		},
		//销毁对话框
		destroy : function(){
			var $parent = this.config.$parent;
			var dilogId = this.$dilog.attr("id");
			if(this.config.modal){
				$("#"+dilogId+"-mask", $parent).remove();
			}
			$("#"+dilogId, $parent).remove();
			return null;
		}
	};
});