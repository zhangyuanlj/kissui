/*
 * 移动端遮罩层组件
 * author:张渊
 * modifyTime:2016-12-20
 */
Ks().package("K.Ui", function(Ks){
	var Tmask = Ks.creatClass(K.Ui.Widget, {
		$widget : CONFIG ? $("#"+CONFIG.widget.mask.styleName) : $(".ks-mask"),
		show : function(){
			var viewSize = this.getViewSize();
			this.$widget.css({
				width : viewSize.docW,
				height : viewSize.winH < viewSize.docH ? viewSize.docH : viewSize.winH
			}).show();
		},
		hide : function(){
			this.$widget.hide();
		},
		display : function(){
			if(this.$widget.css("display") == "block"){
				return true;
			}
			else{
				return false;
			}
		}
	});
	this.Tmask = (function(){
		return new Tmask();
	})();
});
