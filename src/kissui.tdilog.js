/*
 * 移动端对话框组件
 * author:张渊
 * modifyTime:2016-12-20
 */
Ks().package("K.Ui", function(Ks){
	this.TDilog = Ks.creatClass(K.Ui.Widget, {
		defaults : {
			$dilog : $("#dilog"),
			config : CONFIG,
			callback : {
				cancel : function(){
					return true;
				},
				confirm : function(){
					return true;
				}
			}
		},
		_getDilogH : function(){
			var dilogHeight = parseFloat(this.$widget.attr("data-height"))*this.baseFontSize;
			return dilogHeight;
		},
		_registerEvent : function(){
			var $dilog = this.defaults.$dilog;
			var $cancel = $dilog.find(".cancel");
			var $confirm = $dilog.find(".confirm");
			var self = this;
			if($cancel.length){
				$cancel.off().on("mousedown", function(){
					var $this = $(this);
					self.hide(function(){
						K.Ui.Touch.mask("hide");
						self.fireCallback("cancel", [$this]);
					});				
				});
			}
			if($confirm.length){
				$confirm.off().on("mousedown", function(){
					var $this = $(this);
					self.hide(function(){
						self.fireCallback("confirm", [$this]);
					});		
				});
			}
		},
		show : function(){		
			var $dilog = this.defaults.$dilog;
			var self = this;
			var dilogHeight = this._getDilogH();
			var top = $(window).height()/2-dilogHeight/2;
			this.dilogConfig.show['translate'] = "0,"+top+"px";
			K.Ui.Touch.mask("show");
			this.$widget.show().animate(this.dilogConfig.show, this.aniConfig.speed, this.aniConfig.slowType, function(){
				self._registerEvent();
			});
		},
		hide : function(callback){
			this.$widget.animate(this.dilogConfig.hide, this.aniConfig.speed, this.aniConfig.slowType, function(){
				$(this).hide();
				if(typeof callback == "function"){
					callback();
				}
			});
		},
		init : function(options){
			this.callSuper(options);
			var config = this.defaults.config;
			this.$widget = this.defaults.$dilog;
			this.aniConfig = config.animate;
			this.dilogConfig = config.widget.dilog;
			this.baseFontSize = parseFloat($("html").css("font-size"));
			this.show();
		}
	});
});
