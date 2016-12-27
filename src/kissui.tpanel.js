/*
 * 移动端面板组件
 * author:张渊
 * modifyTime:2016-12-20
 */
Ks().package("K.Ui", function(Ks){
	this.TPanel = Ks.creatClass(K.Ui.Widget, {
		defaults : {
			$panel : $("#panel"),
			config : CONFIG,
			selectItem : ".item",
			selectFunc : function($selectItem){
				return true;
			}
		},
		_conScroll : null,
		_registerEvent : function(){
			var self = this;
			this.$widget.off().on("mousedown", this.defaults.selectItem, function(e) {
				var $this = $(this);
				self.hide(function(){
					K.Ui.Touch.mask("hide");
					self.defaults.selectFunc($this);
				});
				e.stopPropagation();
			});
			K.Ui.Touch.mask("addEvent", function(){
				self.hide(function(){
					K.Ui.Touch.mask("hide");
				});
			});
		},
		show : function(){		
			K.Ui.Touch.mask("show");
			this.$widget.show().animate(this.panelConfig.show, this.aniConfig.speed, this.aniConfig.slowType);
		},
		hide : function(callback){
			this.$widget.animate(this.panelConfig.hide, this.aniConfig.speed, this.aniConfig.slowType, function(){
				$(this).hide();
				if(typeof callback == "function"){
					callback();
				}
			});
		},
		createScroll : function(scrollArea){
			this.destroyScroll();
			this._conScroll = new iScroll(scrollArea, {
				vScrollbar: false,
				bounce: false,
				onBeforeScrollStart: function () {
					return true;
				}
			});	
		},
		destroyScroll : function(){
			if(this._conScroll){
				this._conScroll.destroy();
				this._conScroll = null;
			}
		},
		init : function(options){
			this.callSuper(options);
			var config = this.defaults.config;
			this.$widget = this.defaults.$panel;
			this.panelConfig = config.widget.panel;
			this.aniConfig = config.animate;
			this._registerEvent();
		}
	});
});
