/********************************************************************************
 * 常用的jQuery插件
 * @return {[type]} [description]
 ********************************************************************************/
;;;(function($, document){
	
	/**
	 * 弹出层
	 * 使用方法：
	 * $.dialog({
			tmpl : {
				title : '网站提醒您',
				name_confirm : '是的',
				name_cancel : '不的'
			},
			follow : '#J_dialog_2',
			offsets_x : -182,
			offsets_y : 30,
			width : 400,
			success : function(){ console.log('callback_success'); },
			callback_close : function(){ console.log('callback_close'); },
			callback_confirm : function(){ console.log('callback_confirm'); },
			callback_cancel : function(){ console.log('callback_cancel'); }
		});
	 * @return {[type]} [description]
	 */
	$.dialog = function(){
		var def = {
			tmpl : null,				// string / object   弹处层内容的id或内容模板
			skin : null,
			width : 300,				
			height : 200,				
			mask : true,				// boolean  		是否添加遮罩层
			drag : true,				// boolean  		是否绑定拖拽事件
			fixed : true,				// boolean  		是否静止定位
			follow : null,				// string / object  是否跟随自定义元素来定位
			offsets_x : 0,				// number   		相对于自定义元素的X坐标的偏移
			offsets_y : 0,				// number  			相对于自定义元素的Y坐标的偏移
			autoclose : 0,				// number			自动关闭弹出层的时间
			lock : false,				// boolean		   	是否允许ESC键来关闭弹出层
			success : null,				// function		  	关闭弹出层后执行的回调函数
			callback_close : null,		// function 		关闭后执行的回调函数
			callback_confirm : null,	// function 		确认后执行的回调函数
			callback_cancel : null		// function 		取消后执行的回调函数
			/** 
			 *  tmpl为object时的参数格式
			 *	tmpl : {
			 *		header : '弹出层标题',
			 *		content : '弹出层内容',
			 *		yesText : '确定',			// 确定按钮的文本，默认为‘确定’
			 *		noText : '取消' 			// 取消按钮的文本，默认为‘取消’
			 *	}
			 */
		};
		var dialog = $.dialog;
		var opts = {};
		var _opts = {};

		if (typeof arguments[0] == 'object' || typeof arguments[1] == 'object') {
			_opts = $.extend(_opts, (typeof arguments[0] == 'object' ? arguments[0] : arguments[1]));
		}

		
		/**
		 * 初始化
		 * @return {[type]} [description]
		 */
		dialog.init = function(){

			opts = $.extend({}, def, _opts);

			if(opts.action && opts.action == 'close'){
				dialog.fn_close(opts);
				return false;	
			}
			// console.log(opts);
			// 异步加载一个dialog的样式表
			MALL.utils.css('/resources/css/dialog.css?v=' + parseInt(new Date().getTime() / 1000));

			// 创建模板，并插入到body当中
			var tmpl = dialog.template(opts);
			$('body').append(tmpl);
			if(opts.tmpl.content){
				$('#J_dialog_area .bd').html(opts.tmpl.content);
			}

			// 执行打开后的callback
			if(typeof opts.success === 'function') {
				dialog.success(opts);
			}

			// 定位
			var $obj_dialog = $('#J_dialog_area');
			if(opts.follow) {
				var $obj_follow = $(opts.follow);
				var x = opts.offsets_x;
				var y = opts.offsets_y;
				dialog.follow($obj_dialog, $obj_follow, x, y);
			} else {
				dialog.position($obj_dialog, opts.fixed);
			}

			// 如果有遮罩层
			if(opts.mask) dialog.mask();

			// 绑定关闭后的callback
			var $obj_close = $('#J_dialog_close');
			if($obj_close[0]) {
				GLOBAL.addEvent($obj_close[0], 'click', function(){
					dialog.fn_close(opts);
				});
			}

			// 绑定ESC键关闭弹出层
			if(!opts.lock) {
				GLOBAL.addEvent(document, 'keyup', keyEvent);
			}
			function keyEvent(e){
				if(e.keyCode === 27) {
					dialog.fn_close(opts);
				}
			}

			// 绑定自动关闭
			if(opts.autoclose && typeof opts.autoclose === 'number') {
				var dialog_timeout = setTimeout(function(){ dialog.fn_close(opts) }, opts.autoclose);
			}

			// 绑定确定后的callback
			var $obj_confirm = $('#J_dialog_confirm');
			if($obj_confirm[0]) {
				GLOBAL.addEvent($obj_confirm[0], 'click', function(){
					dialog.fn_confirm(opts);
				});
			}

			// 绑定取消后的callback
			var $obj_cancel = $('#J_dialog_cancel');
			if($obj_cancel[0]) {
				GLOBAL.addEvent($obj_cancel[0], 'click', function(){
					dialog.fn_cancel(opts);
				});
			}

		}

		/**
		 * 遮罩
		 * @return {[type]} [description]
		 */
		dialog.mask = function(){
			var dom_mask = $('#J_mask');

			var $obj_mask = $('#J_mask');
			// alert(!-[1,]&&!window.XMLHttpRequest);
			if($obj_mask[0]) {
				var style = dom_mask.style;
				if(GLOBAL.ie6){
					var client_height = $('body').height();
					$obj_mask.css({ 'height' : client_height });
				} else {
					$obj_mask.css({
						'position' : 'fixed',
						'top' : '0px',
						'right' : '0px',
						'bottom' : '0px',
						'left' : '0px'
					});
				}
			}
		}

		/**
		 * 定位
		 * @param  {[type]} elem  [description]
		 * @param  {[type]} fixed [description]
		 * @return {[type]}       [description]
		 */
		dialog.position = function(elem, fixed) {
			// 优先定位，防止在计算DOM宽度的时候，出现错误
			elem.css({ 'position' : GLOBAL.ie6 ? 'absolute' : fixed ? 'fixed' : 'absolute' });
			
			var elem_margin_top =  '-' + (elem.height() / 2) + 'px';
			var elem_margin_left = '-' + (elem.width() / 2) + 'px';

			elem.css({
				'top' : '50%',
				'left' : '50%',
				'margin-top' : elem_margin_top,
				'margin-left' : elem_margin_left,
				'display' : 'block'
			});
		}

		/**
		 * 跟随定位
		 * @param  {[type]} elem   [需要定位的元素]
		 * @param  {[type]} follow [被跟随的目标元素]
		 * @param  {[type]} x      [x轴的偏移量]
		 * @param  {[type]} y      [y轴的偏移量]
		 * @return {[type]}        [description]
		 */
		dialog.follow = function(elem, follow, x, y){
			var follow_offsets_x = follow.offset().left + x;
			var follow_offsets_y = follow.offset().top + y;

			// console.log(follow_offsets_x);
			// console.log(follow_offsets_y);

			elem.css({
				'position' : 'absolute',
				'top' : follow_offsets_y,
				'left' : follow_offsets_x
			});
		}

		/**
		 * 成功后的回调函数
		 * @param  {[type]} args [description]
		 * @return {[type]}      [description]
		 */
		dialog.success = function(args) {
			if(args && typeof args.success === 'function'){
				args.success();
			}
		}

		/**
		 * 点击dialog里面的《确认》按钮后的callback
		 * @return {[type]} [description]
		 */
		dialog.fn_confirm = function(args){
			if(args && typeof args.callback_confirm === 'function'){
				args.callback_confirm();
				dialog.fn_close();
			}
		}

		/**
		 * 点击dialog里面的《取消》按钮后的callback
		 * @return {[type]} [description]
		 */
		dialog.fn_cancel = function(args){
			if(args && typeof args.callback_cancel === 'function'){
				args.callback_cancel();
				dialog.fn_close();
			}
		}

		/**
		 * 点击dialog里面的《关闭》按钮后的callback
		 * @param  {[type]} opts [description]
		 * @return {[type]}      [description]
		 */
		dialog.fn_close = function(args) {
			var $obj_dialog = $('#J_dialog_area');

			// 判断DOM是否存在
			// 防止某些事件的重复执行
			if($obj_dialog){
				if(args && typeof args.callback_close === 'function'){
					args.callback_close();
				}

				// 移除dialog的DOM节点
				if($obj_dialog[0]) {
					$obj_dialog.remove();
				}
				// 移除遮罩层
				var $obj_mask = $('#J_mask');
				if($obj_mask) {
					$obj_mask.remove();
				}
			}

			// clearTimeout(GLOBAL.timeout);
		}

		/**
		 * 模板
		 * @return {[type]} [description]
		 */
		dialog.template = function(args){
			// var temp_content = $('#J_temp_content');
			var args = args || {};
			var skin = args.skin || '';
			var title = args.tmpl && args.tmpl.title ? '<div class="hd"><h4 class="hd_t">'+ args.tmpl.title +'</h4></div>' : '';
			// var content = args.tmpl && args.tmpl.content ? args.tmpl.content : '<p class="ui_loading"><b class="icon_loading"></b>正在加载，请稍后...</p>';
			var content = '<p class="ui_loading"><b class="icon_loading"></b>正在加载，请稍后...</p>';

			var btn_confirm = typeof args.callback_confirm === 'function' ? '<a href="javascript:void(0);" class="ui_dialog_confirm" id="J_dialog_confirm">' + (typeof args.tmpl.name_confirm === 'string' ? args.tmpl.name_confirm : '确定') + '</a>' : '';
			var btn_cancel = typeof args.callback_cancel === 'function' ? '<a href="javascript:void(0);" class="ui_dialog_cancel" id="J_dialog_cancel">' + (typeof args.tmpl.name_cancel === 'string' ? args.tmpl.name_cancel : '取消') + '</a>' : '';
			var footer = btn_confirm === '' && btn_cancel === '' ? '' : '<div class="ft">' + btn_confirm + btn_cancel + '</div>';
			var mask = args.mask ? '<div class="ui_mask" id="J_mask"></div>' : '';

			var tmpl = [
				'<div class="ui_dialog_area" id="J_dialog_area">',
					'<div class="ui_dialog_mod ' + skin + '" style="width:' + args.width + 'px; height:' + args.height + 'px">',
						title,
						'<div class="bd">'+ content + '</div>',
						footer,
						'<a href="javascript:void(0);" class="ui_dialog_close" id="J_dialog_close">关闭</a>',
					'</div>',
				'</div>',
				mask
			].join('');
			return tmpl;
		}

		return dialog.init();
	}
})(jQuery, document);