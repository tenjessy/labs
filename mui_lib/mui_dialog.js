/**
 * dialog对话窗口
 * 目前的需求主要有：
 * 		1、自动弹出
 * 		2、弹出后，是否有遮罩层
 * 		3、在弹出窗口的基础上，再次弹出一个操作提示条
 * 		4、换肤功能
 * 		5、自动关闭
 * 		6、关闭、确定、取消的回调
 * 		7、根据某个元素进行定位
 */


;;;(function(){
	if(!window.MFH){
		window['MFH'] = {}
	}

	
	var dialog = function(opts){
		opts = opts || {};
		this.skin = opts.skin;
		this.width = opts.width || 500;
		this.height = opts.height || 500;
		this.title = opts.title;
		this.content = opts.content || 'fuck';
		
		this.mask = opts.mask;
		this.close_callback = opts.close_callback;
		
	}
	window['MFH']['dialog'] = dialog;

})();

;;(function($, document){
	/**
	 * dialog插件
	 * @return {[type]} [description]
	 */
	$.fn.dialog = function(opts){

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

		// 使用extend方法从opts和defaults对象中构造出一个opts对象  
		var opts = $.extend({}, defaults, opts);

		var self = this;
		var $self = $(this);

		return this.each(function(){
			console.log()
		});

		return this;
	}
})(jQuery, document);