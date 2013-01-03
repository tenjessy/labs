/**
 * dialog对话窗口
 */

;;(function($, document){
	/**
	 * dialog插件
	 * @return {[type]} [description]
	 */
	$.fn.dialog = function(options){

		// 创建一个默认设置对象
		var defaults = {
			skin 		: 		'dialog',				// 主题名的后缀
			width 		: 		500,					// 默认宽度
			height 		: 		500,					// 默认高度
			open 		: 		null,					// 打开后执行的callback
			close 		: 		null,					// 关闭后执行的callback
			title 		: 		'美肤汇提示您',			// 标题
			content 	: 		'正在加载，请稍后...',	// 内容
			mask 		: 		true,					// 是否遮罩
			drag 		: 		true,					// 是否拖动
			time_out 	: 		0						// 关闭延迟时间
		}

		// 使用extend方法从options和defaults对象中构造出一个opts对象  
		var opts = $.extend({}, defaults, options);

		var self = this;
		var $self = $(this);

		return this.each(function(){
			console.log()
		});

		return this;
	}
})(jQuery, document);