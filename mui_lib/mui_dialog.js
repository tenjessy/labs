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
if(!window.GLOBAL) window.GLOBAL = {}
GLOBAL = {
	timeout : null,

	/**
	 * 确定是否为IE6
	 * 如果是，则返回true，否则返回false
	 * @type {[type]}
	 */
	ie6 : !-[1,]&&!window.XMLHttpRequest,

	/**
	 * 绑定事件
	 * @param {[type]} node     [description]
	 * @param {[type]} type     [description]
	 * @param {[type]} listener [description]
	 */
	addEvent : function(node, type, listener) {
		if(node.addEventListener) {
			node.addEventListener (type, listener, false);
			return true ;
		} else if (node.attachEvent) {
			node.attachEvent ('on' + type, listener);
			return true ;
		} else {
			node['on' + type] = listener ;
			return true ;
		}
		return false ;
	},

	/**
	 * 卸载事件
	 * @param  {[type]} node     [description]
	 * @param  {[type]} type     [description]
	 * @param  {[type]} listener [description]
	 * @return {[type]}          [description]
	 */
	removeEvent : function(node, type, listener) {
		if(node.removeEventListener) {
			node.removeEventistener (type, listener, false);
			return true;
		} else if (node.detachEvent) {
			node.detachEvent ('on' + type, listener);
			return true;
		} else {
			node['on' + type] = null ;
			return true ;
		}
		// 若两种方法都不具备，则返回false
		return false;
	},

	/**
	 * 移除DOM节点
	 * 摘自：http://www.cnblogs.com/rubylouvre/archive/2009/07/17/1525637.html
	 * !+"\v1"是判断IE6、7、8
	 * @param  {[type]} node [description]
	 * @return {[type]}      [description]
	 */
	removeNode : function(node){
		if(!+"\v1"){
			return function(){
				if(node && node.tagName != 'body'){
					var d = document.createElement('div');
					d.appendChild(node);
					d.innerHTML = '';
				}
			}();
		} else {
			if(node && node.parentNode && node.tagName != 'body'){
				node.parentNode.removeChild(node);
			}
		}
	},

	/**
	 * 获取指定元素在页面当中的位置
	 * @param  {[type]} elem [description]
	 * @return {[type]}      [description]
	 */
	getOffsets : function(elem){
		var top = elem.offsetTop;
		var left = elem.offsetLeft;
		var current = elem.offsetParent;
		while(current !== null){
			top += current.offsetTop;
			left += current.offsetLeft;
			current = current.offsetParent;
		}
		return {
			top : top,
			left : left
		}
	}
}

;;;(function(){
	if(!window.MFH){
		window['MFH'] = {}
	}

	/**
	 * 弹出层
	 * 该功能的核心功能主要参考了“雨夜带刀”的easyDialog，详情可见http://stylechen.com/wp-content/uploads/demo/easydialog-v2.0/index.html
	 * 使用方法：
	 * var new_dialog = new dialog();
	 * new_dialog.create({
	 * 		tmpl : {
				title : '美肤汇提醒您',
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
	 * });
	 * @return {[type]} [description]
	 */
	var dialog = function(){}
	dialog.prototype = {
		constructor : dialog,
		/**
		 * 获取参数
		 * @return {[type]} [description]
		 */
		getOpts : function(opts){
			var arg = {};
			var i;
			var defaults = {
					tmpl : null,				// string / object   弹处层内容的id或内容模板
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

			for(i in defaults) {
				arg[i] = opts[i] !== undefined ? opts[i] : defaults[i];
			}
			return arg;
		},

		/**
		 * 初始化
		 * 创建
		 * @param  {[type]} opts [description]
		 * @return {[type]}      [description]
		 */
		create : function(opts){
			var _this = this;
			var opts = this.getOpts(opts);

			// 如果是跟随定位，则必须把fixed设置为false
			if(opts.follow) {
				opts.fixed = false;
			}

			// 创建模板，并插入到body当中
			var tmpl = this.template(opts);
			$('body').append(tmpl);

			// 定位
			var dom_dialog = document.getElementById('J_dialog_area');
			if(opts.follow) {
				var elem_follow = document.getElementById(opts.follow);
				var x = opts.offsets_x;
				var y = opts.offsets_y;
				_this.follow(dom_dialog, elem_follow, x, y);
			} else {
				_this.position(dom_dialog, opts.fixed);
			}

			// 如果有遮罩层
			if(opts.mask) _this.mask();

			// 执行打开后的callback
			if(typeof opts.success === 'function') {
				opts.success();
			}
			
			// 绑定关闭后的callback
			var btn_close = document.getElementById('J_dialog_close');
			if(btn_close) {
				GLOBAL.addEvent(btn_close, 'click', function(){
					_this.fn_close(opts);
				});
			}

			// 绑定ESC键关闭弹出层
			if(!opts.lock) {
				GLOBAL.addEvent(document, 'keyup', keyEvent);
			}

			function keyEvent(e){
				if(e.keyCode === 27) {
					_this.fn_close(opts);
				}
			}

			// 绑定自动关闭
			if(opts.autoclose && typeof opts.autoclose === 'number') {
				GLOBAL.timeout = setTimeout(function(){ _this.fn_close(opts) }, opts.autoclose);
			}

			// 绑定确定后的callback
			var btn_confirm = document.getElementById('J_dialog_confirm');
			if(btn_confirm) {
				GLOBAL.addEvent(btn_confirm, 'click', function(){
					_this.fn_confirm(opts);
				});
			}

			// 绑定取消后的callback
			var btn_cancel = document.getElementById('J_dialog_cancel');
			if(btn_cancel) {
				GLOBAL.addEvent(btn_cancel, 'click', function(){
					_this.fn_cancel(opts);
				});
			}
		},

		/**
		 * 遮罩
		 * @return {[type]} [description]
		 */
		mask : function(){
			var dom_mask = document.getElementById('J_mask');
			
			if(dom_mask) {
				var style = dom_mask.style;
				if(GLOBAL.ie6){
					var client_height = document.documentElement.clientHeight;
					style.height = client_height + 'px';
				} else {
					style.cssText = 'position:fixed; top:0px; right:0px; bottom:0px; left:0px;'
				}
			}
		},

		/**
		 * 定位
		 * @param  {[type]} elem  [description]
		 * @param  {[type]} fixed [description]
		 * @return {[type]}       [description]
		 */
		position : function(elem, fixed){
			var style = elem.style;
			style.position = ie6 ? 'absolute' : fixed ? 'fixed' : 'absolute';
			var width = elem.offsetWidth;
			var height = elem.offsetHeight;
			
			var margin_top = height / 2;
			var margin_left = width / 2;
			
			style.top = '50%';
			style.left = '50%';
			style.marginTop = '-' + margin_top + 'px';
			style.marginLeft = '-' + margin_left + 'px';
		},

		/**
		 * 跟随定位
		 * @param  {[type]} elem   [需要定位的元素]
		 * @param  {[type]} follow [被跟随的目标元素]
		 * @param  {[type]} x      [x轴的偏移量]
		 * @param  {[type]} y      [y轴的偏移量]
		 * @return {[type]}        [description]
		 */
		follow : function(elem, follow, x, y){
			var follow = typeof follow === 'string' ? document.getElementById(follow) : follow;
			var style = elem.style;
			style.position = 'absolute';

			var offsets = GLOBAL.getOffsets(follow);
			var follow_offsets_x = offsets.left;
			var follow_offsets_y = offsets.top;

			style.left = follow_offsets_x + x + 'px';
			style.top = follow_offsets_y + y + 'px';
		},

		/**
		 * 点击dialog里面的《关闭》按钮按钮后的callback
		 * @param  {[type]} opts [description]
		 * @return {[type]}      [description]
		 */
		fn_close : function(opts, e){
			var dom_dialog = document.getElementById('J_dialog_area');

			// 判断DOM是否存在
			// 防止某些事件的重复执行
			if(dom_dialog){
				if(opts && typeof opts.callback_close === 'function'){
					opts.callback_close();
				}

				// 移除dialog的DOM节点
				if(dom_dialog) {
					GLOBAL.removeNode(dom_dialog);
				}
				// 移除遮罩层
				var dom_mask = document.getElementById('J_mask');
				if(dom_mask) {
					GLOBAL.removeNode(dom_mask);
				}
			}

			clearTimeout(GLOBAL.timeout);
		},

		/**
		 * 点击dialog里面的《确认》按钮后的callback
		 * @return {[type]} [description]
		 */
		fn_confirm : function(opts){
			if(opts && typeof opts.callback_confirm === 'function'){
				opts.callback_confirm();
				this.fn_close();
			}
		},

		/**
		 * 点击dialog里面的《取消》按钮后的callback
		 * @return {[type]} [description]
		 */
		fn_cancel : function(opts){
			if(opts && typeof opts.callback_cancel === 'function'){
				opts.callback_cancel();
				this.fn_close();
			}
		},

		/**
		 * 模板
		 * @return {[type]} [description]
		 */
		template : function(opts){
			var _this = this;
			var opts = opts || {};
			var title = opts.tmpl.title ? '<div class="hd"><h4 class="hd_t">'+ opts.tmpl.title +'</h4></div>' : '';
			var content = opts.tmpl.content ? opts.tmpl.content : '<p class="ui_loading"><b class="icon_loading"></b>正在加载，请稍后...</p>';
			var btn_confirm = typeof opts.callback_confirm === 'function' ? '<button class="ui_dialog_confirm" id="J_dialog_confirm">' + (typeof opts.tmpl.name_confirm === 'string' ? opts.tmpl.name_confirm : '确定') + '</button>' : '';
			var btn_cancel = typeof opts.callback_cancel === 'function' ? '<button class="ui_dialog_cancel" id="J_dialog_cancel">' + (typeof opts.tmpl.name_cancel === 'string' ? opts.tmpl.name_cancel : '取消') + '</button>' : '';
			var footer = btn_confirm === '' && btn_cancel === '' ? '' : '<div class="ft">' + btn_confirm + btn_cancel + '</div>';
			var mask = opts.mask ? '<div class="ui_mask" id="J_mask"></div>' : '';

			var tmpl = [
				'<div class="ui_dialog_area" id="J_dialog_area">',
					'<div class="ui_dialog_mod" style="width:' + opts.width + 'px; height:' + opts.height + 'px">',
						title,
						'<div class="bd">' + content + '</div>',
						footer,
						'<a href="javascript:void(0);" class="ui_dialog_close" id="J_dialog_close">关闭</a>',
					'</div>',
				'</div>',
				mask
			].join('');
			return tmpl;
		}
	}
	window['MFH']['dialog'] = dialog;

})();

;;;(function($, jQuery){

	/**
	 * 弹出层
	 * 使用方法：
	 * $.dialog({
			tmpl : {
				title : '美肤汇提醒您',
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
		var self = this;
		var opts = {};
		var _opts = {};

		if (typeof arguments[0] == 'object' || typeof arguments[1] == 'object') {
			_opts = $.extend(_opts, (typeof arguments[0] == 'object' ? arguments[0] : arguments[1]));
		}

		/**
		 * 初始化
		 * @return {[type]} [description]
		 */
		self.init = function(){
			opts = $.extend({}, def, _opts);
			// console.log(opts);

			// 创建模板，并插入到body当中
			var tmpl = self.template(opts);
			$('body').append(tmpl);

			// 执行打开后的callback
			if(typeof opts.success === 'function') {
				self.success(opts);
			}

			// 定位
			var $obj_dialog = $('#J_dialog_area');
			if(opts.follow) {
				var $obj_follow = $(opts.follow);
				var x = opts.offsets_x;
				var y = opts.offsets_y;
				self.follow($obj_dialog, $obj_follow, x, y);
			} else {
				self.position($obj_dialog, opts.fixed);
			}

			// 如果有遮罩层
			if(opts.mask) self.mask();

			// 绑定关闭后的callback
			var $obj_close = $('#J_dialog_close');
			if($obj_close[0]) {
				GLOBAL.addEvent($obj_close[0], 'click', function(){
					self.fn_close(opts);
				});
			}

			// 绑定ESC键关闭弹出层
			if(!opts.lock) {
				GLOBAL.addEvent(document, 'keyup', keyEvent);
			}
			function keyEvent(e){
				if(e.keyCode === 27) {
					self.fn_close(opts);
				}
			}

			// 绑定自动关闭
			if(opts.autoclose && typeof opts.autoclose === 'number') {
				GLOBAL.timeout = setTimeout(function(){ self.fn_close(opts) }, opts.autoclose);
			}

			// 绑定确定后的callback
			var $obj_confirm = $('#J_dialog_confirm');
			if($obj_confirm[0]) {
				GLOBAL.addEvent($obj_confirm[0], 'click', function(){
					self.fn_confirm(opts);
				});
			}

			// 绑定取消后的callback
			var $obj_cancel = $('#J_dialog_cancel');
			if($obj_cancel[0]) {
				GLOBAL.addEvent($obj_cancel[0], 'click', function(){
					self.fn_cancel(opts);
				});
			}

			return self;
		}

		/**
		 * 遮罩
		 * @return {[type]} [description]
		 */
		self.mask = function(){
			var dom_mask = $('#J_mask');

			var $obj_mask = $('#J_mask');
			
			if($obj_mask[0]) {
				var style = dom_mask.style;
				if(GLOBAL.ie6){
					var client_height = $('html, body').height();
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
		self.position = function(elem, fixed) {
			// 优先定位，防止在计算DOM宽度的时候，出现错误
			elem.css({ 'position' : GLOBAL.ie6 ? 'absolute' : fixed ? 'fixed' : 'absolute' });
			
			var elem_margin_top =  '-' + (elem.height() / 2) + 'px';
			var elem_margin_left = '-' + (elem.width() / 2) + 'px';

			elem.css({
				'top' : '50%',
				'left' : '50%',
				'margin-top' : elem_margin_top,
				'margin-left' : elem_margin_left
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
		self.follow = function(elem, follow, x, y){
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
		self.success = function(args) {
			if(args && typeof args.success === 'function'){
				args.success();
			}
		}

		/**
		 * 点击dialog里面的《确认》按钮后的callback
		 * @return {[type]} [description]
		 */
		self.fn_confirm = function(args){
			if(args && typeof args.callback_confirm === 'function'){
				args.callback_confirm();
				self.fn_close();
			}
		}

		/**
		 * 点击dialog里面的《取消》按钮后的callback
		 * @return {[type]} [description]
		 */
		self.fn_cancel = function(args){
			if(args && typeof args.callback_cancel === 'function'){
				args.callback_cancel();
				self.fn_close();
			}
		}

		/**
		 * 点击dialog里面的《关闭》按钮后的callback
		 * @param  {[type]} opts [description]
		 * @return {[type]}      [description]
		 */
		self.fn_close = function(args) {
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
		self.template = function(args){
			var _this = this;
			var args = args || {};
			var title = args.tmpl.title ? '<div class="hd"><h4 class="hd_t">'+ args.tmpl.title +'</h4></div>' : '';
			var content = args.tmpl.content ? args.tmpl.content : '<p class="ui_loading"><b class="icon_loading"></b>正在加载，请稍后...</p>';
			var btn_confirm = typeof args.callback_confirm === 'function' ? '<button class="ui_dialog_confirm" id="J_dialog_confirm">' + (typeof args.tmpl.name_confirm === 'string' ? args.tmpl.name_confirm : '确定') + '</button>' : '';
			var btn_cancel = typeof args.callback_cancel === 'function' ? '<button class="ui_dialog_cancel" id="J_dialog_cancel">' + (typeof args.tmpl.name_cancel === 'string' ? args.tmpl.name_cancel : '取消') + '</button>' : '';
			var footer = btn_confirm === '' && btn_cancel === '' ? '' : '<div class="ft">' + btn_confirm + btn_cancel + '</div>';
			var mask = args.mask ? '<div class="ui_mask" id="J_mask"></div>' : '';

			var tmpl = [
				'<div class="ui_dialog_area" id="J_dialog_area">',
					'<div class="ui_dialog_mod" style="width:' + args.width + 'px; height:' + args.height + 'px">',
						title,
						'<div class="bd">' + content + '</div>',
						footer,
						'<a href="javascript:void(0);" class="ui_dialog_close" id="J_dialog_close">关闭</a>',
					'</div>',
				'</div>',
				mask
			].join('');
			return tmpl;
		}

		return self.init();
	}
})(jQuery, document);
