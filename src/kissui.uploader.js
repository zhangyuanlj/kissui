/*
 * 异步上传
 * author:张渊
 * modifyTime:2015-12-2
 */
(function($){
	var FILE_LOADBAR_WIDTH = 120;
	var LOADBAR_SHOW_TIME = 2;
	var KUploader = function(config){
		this.uploader = null;
		this.uploaderDestory = false;
		this.config = {
			browseBtn : "browseBtn",
			$container : $("#uploadWrap"),
			$uploadBtn : $("#uploadBtn"),
			url : "upload.php",
			requestData : null,
			fileDataName : "file",
			pluploadPath : "/kissUi2.0/plugin/plupload/",
			fileSize : "10mb",
			mimeType : [
				{title : "files", extensions : "jpg,jpeg,gif,png,zip,rar,doc,docx,xls,xlsx,ppt,pptx"}
			],
			multi : false,
			//使用该参数对将要上传的图片进行压缩（仅对图片上传控件有效）
			resize : {
			  width : 100,
			  height : 100,
			  crop : true,
			  quality : 80,
			  preserve_headers : false
			},
			autoUpload : true,
			compType : "file"
		};
		this._setConfig(config);
		this._init();
	};
	KUploader.prototype = {
		_init : function(){
			var that = this;
			var _config = this.config;
			var $container = _config.$container;
			var compType = _config.compType;
			var fileTemp = '<div id="{{fileId}}" class="ks-upload-file-item">'
						 +		'<div class="item-infor">'
						 + 			'<span class="name" title="{{title}}">{{name}}</span>'
						 +			'<span class="size">({{fileSize}})</span>'
						 +			'<span class="percent">0%</span>'
						 +			'<a href="javascript:void(0);" class="remove" onclick="$(this).parents(\'.ks-upload-file-item\').remove();"></a>'
						 +		'</div>'
						 +		'<div class="item-loading">'
						 +			'<div class="item-loading-bar"></div>'
						 +		'</div>'
						 +	'</div>';
			var imageTemp = '';
			var uploadTemp = {
				file : fileTemp,
				image : imageTemp	
			};
			//实例化plupload
			this.uploader = new plupload.Uploader({
				runtimes : "html5,flash,silverlight,html4",
				browse_button : _config.browseBtn,
				url : _config.url,
				multipart_params : _config.requestData,
				file_data_name : _config.fileDataName,
				multi_selection : _config.multi,
				flash_swf_url : _config.pluploadPath+"Moxie.swf",
				silverlight_xap_url : _config.pluploadPath+"Moxie.xap",
				filters : {
					max_file_size : _config.fileSize,
					mime_types: _config.mimeType
				},
				resize : _config.resize,
				init : {
					PostInit : function() {
						$container.html("");
						if(!_config.autoUpload){
							_config.$uploadBtn.bind("click", function() {
								that.uploader.start();
							});
						}
					},
					FilesAdded : function(up, files) {
						var add = true;
						plupload.each(files, function(file) {
							if(compType == "file"){
								that._addFile($container, uploadTemp["file"], file);
							}
						});
						if(_config.autoUpload && add){
							that.uploader.start();
						}
					},
					UploadProgress : function(up, file) {
					    if(compType == "file"){
							that._uploadFile(file);
						}
					},
					FileUploaded : function(up, file, data){
						if(compType == "file"){
							that._fileUploaded(file, data);
						}
						that.getFileData();
					},
					Error : function(up, err) {
						var message = [
							"<p>文件<span style=\"color:#F00;\">"+err.file.name+"</span>超过指定大小(<span style=\"color:#F00;\">"+_config.fileSize+"</span>)，请重新选择！！！</p>", 
							"<p>上传<span style=\"color:#F00;\">"+err.file.name+"</span>时出错，请稍后重试！！！</p>"
						];
						var content = err.code == -600 ? message[0] : message[1];
						var errTxt = content
						            +"<p>错误代码："+err.code+"</p>"
									+"<p>错误详情："+err.message+"</p>";
						var alertDilog = that._createAlert("出错啦", errTxt);
					}
				}
			});
			this.uploader.init();
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
		 * 添加文件
		 * @param Object $container 显示文件列表的容器
		 * @param String fileTemp 上传列表模板
		 * @param Object file plupload返回的文件对象
		 */
		_addFile : function($container, fileTemp, file){
			var temp = fileTemp.replace(/{{fileId}}/g, file.id);
			temp = temp.replace(/{{title}}/g, file.name);
			temp = temp.replace(/{{name}}/g, KStr.string.cutOutStr(file.name, 16, "..."));
			temp = temp.replace(/{{fileSize}}/g, plupload.formatSize(file.size));
			$container.append(temp);
			return true;
		},
		/**
		 * 上传文件
		 * @param Object file plupload返回的文件对象
		 */
		_uploadFile : function(file){
			var $item = $("#"+file.id);
			$item.children(".item-loading").css("visibility", "visible");
			$item.children().find(".percent").html(file.percent+"%");
			$item.children().find(".item-loading-bar").width(FILE_LOADBAR_WIDTH*(file.percent/100));
		},
		/**
		 * 一个文件上传成功
		 * @param Object file plupload返回的文件对象
		 * @param Object data plupload上传成功后返回的对象
		 */
		_fileUploaded : function(file, data){
			var $item = $("#"+file.id);
			$item.attr("data-response", data.response);
			KTool.timerFunc(LOADBAR_SHOW_TIME, null, function(){
				$item.children(".item-loading").css("visibility", "hidden");
			});
		},
		/**
		 * 创建一个警告对话框
		 * @param String title 对话框标题
		 * @param String content 对话框内容
		 */
		_createAlert : function(title, content){
			var alertDilog = new KDilog({
				isConDilog : false
			});
			alertDilog.createAlert(280, title, content);
			return alertDilog;
		},
		/**
		 * 获取上传文件列表
		 * @return String data 供后台解析的JSON字符串
		 */
		getFileData : function(){
			var data = [];
			this.config.$container.children(".ks-upload-file-item").each(function(){
				data.push($(this).attr("data-response"));
			});
			data = '{"data":['+data.join(",")+']}';
			return data;
		},
		//销毁上传组件
		destroy : function(){
			var _config = this.config;
			_config.$container.html("");
			this.uploader.destroy();
			if(!_config.autoUpload){
				_config.$uploadBtn.unbind("click");
			}
			this.uploaderDestory = true;
			this.uploader = null;
			return null;
		}
	};
	window.KUploader = KUploader;
})(jQuery);