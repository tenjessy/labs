/**
 * author:tenjessy@gmail.com
 * 核心脚本，包括一些常用的小工具、UI插件、全局命名空间等等；
 * 默认情况下，该文件不应该被经常更新；
 * 如果要更新，就必须遵循一个原则（某个函数或者方法需要在全站超过3个地方被用到）；
 * 跟UI界面相关的JS，尽量写成jQuery插件的形式；
 * 跟业务逻辑相关的JS，尽量在同一个命名空间当中，尽量统一编码风格；
 * @type {Object}
 */
if(!window.GLOBAL) window.GLOBAL = {}
	GLOBAL = {
			
		/**
		 * 确定是否为IE6
		 * 如果是，则返回true，否则返回false
		 * @type {[type]}
		 */
		ie6 : !-[1,]&&!window.XMLHttpRequest,

		getEvent : function(e){
			return e ? e : window.e;
		},

		getTarget : function(e){
			return e.target || e.srcElement;
		},

		preventDefault : function(e){
			if(e.preventDefault){
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
		},

		stopPropagation : function(e){
			if(e.stopPropagation){
				e.stopPropagation();
			} else if(window.e) {
				window.e.cancelBubble = true;
			}
		},

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
				node.removeEventistener ( type, listener, false );
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
		 * 首字母大写转换
		 * @param {string} [要转换的字符串]
		 * @return {[type]} [转换后的字符串 top => Top]
		 */
		capital : function(str){
			var first = str.charAt(0);
			return first.toUpperCase() + str.replace(first, '');
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
		},

		sign_in_credit : 1,
		create_accoun_credit : 10,

		/**
		 * 免邮价格
		 * @type {Number}
		 */
		free_shipping_price : 99,

		// 积分
		credit : {
			login : 1,
			create_account : 10
		},

		// 请求地址
		url : {
			user : '/user.php',
			lottery : '/lottery.php',
			buy : '/flow.php',
			flow : '/flow.php'
		},

		step : {
			get_cart : 'get_cart_goods',
			del_goods : 'drop_goods',
			payment_change : 'change_payment',
			payment_check : 'payment_check'
		},

		mod : {
			avatar : 'user',
			home : 'home'
		},

		act : {
			avatar : 'setlogo',
			mini_user : 'panel',
			supplementary: 'set_email',
			profile : 'act_edit_profile',
			collect : 'collect',
			home : 'promotion',
			login : 'act_login',
			lottery : 'check',
		},

		tips : {
			dialog_title : '本商品提示您',
			supplementary_sign : '欢迎登录，建议您完善信息！补填信息送10积分',
			email_empty : '请输入邮箱账号',
			email_test : '请输入正确的邮箱账号',
			password_different : '两次输入的密码不一致，请重新输入',
			password_length : '请输入6位以上的密码，且不包含空格',
			cart_empty : '您的购物车中还没有宝贝，快去挑选吧',
			error : '系统故障，请稍后再试',
			error_parameter : '参数出错，请稍后再试',
			login : '登录成功，积分<span class="num">+1</span>'
		}
	}

/**
 * 全站通用函数
 * @return {[type]} [description]
 */
;;;(function(){
	if(!window.MALL){
		window['MALL'] = {}
	}

	/**
	 * 封装一个ajax请求
	 * type : 请求类型
	 * url : 请求的url
	 * 数据 ：必须为一个对象，而不能像原jQuery里那样的ajax那样，使用字符串
	 *
	 * 每次ajax请求，我都会在data对象当中额外增加4个参数
	 * t : 时间参数，防止ajax请求的是缓存数据
	 * f : 表示当前需要返回json数据
	 * json : json格式的数据
	 * _xsrf : 当前用户的唯一标识
	 *
	 *用法
	 *	MALL.ajax({
	 *		type : 'POST',
	 *		url : '/test.php',
	 *		data : {
	 *			key_1 : value_1,
	 *			key_2 : value_2,
	 *			key_3 : value_3
	 *		},
	 *		success : function(response, textStatus, jqXHR){ console.log(suddess) };
	 *	});
	 * 
	 * @param  {[type]} opts [description]
	 * @return {[type]}           [description]
	 */
	var ajax = function(opts){
		var opts = opts || {};
		var type = opts.type;
		var url = opts.url;
		var data = opts.data;
		var beforeSend = opts.beforeSend || function(XMLHttpRequest){};
		var complete = opts.complete || function(XMLHttpRequest, textStatus){};
		var success = opts.success || function(response, textStatus, jqXHR){};

		// 额外参数
		var data = data || {}
		var _xsrf = $.cookie('_xsrf');	// _xsfr
		var t = new Date().getTime();	// 时间截
		var f = 'json';					// 指定返回json
		var json = 1;

		data._xsrf = _xsrf;
		data.t = t;
		data.f = f;
		data.json = json;

		$.ajax({
			url: url,
			data: data,
			type: type,
			beforeSend : beforeSend,
			complete : complete,
			success: success
		});
	}
	window['MALL']['ajax'] = ajax;


	/**
	 * 一些小工具
	 * @type {Object}
	 */
	var utils = {
		/**
		 * 收藏本站
		 * @param  {[type]} opts [description]
		 * @return {[type]}      [description]
		 */
		bookmark : function(){
			var title = document.title;
			var href = window.location.href;

			try {
				window.external.AddFavorite(href, title);			// IE
			} catch(e) {
				try {
					window.sidebar.addPanel(title, href, '');		// Firefox
				} catch(e) {
					alert('加入收藏失败，请使用Ctrl + D收藏本站');	//chrome opera safari
				}
			}
		},

		/**
		 * URL的解析
		 * 摘自《JavaScript权威指南》第六版
		 * 获取location.search后面的所有参数，并返回一个对象
		 *
		 * 用法：
		 * var args_url = MALL.utils.url();
		 * 
		 * @return {[type]} [description]
		 */
		url : function(){
			var args = {};
			// 获取?后面的字符串
			var query = location.search.substring(1);
			// 以&作为分割点，返回数组
			var pairs = query.split('&');
			for(var i = 0; i < pairs.length; i++) {
				var pos = pairs[i].indexOf('=');
				if(pos == -1) continue;
				var name = pairs[i].substring(0, pos);
				var value = pairs[i].substring(pos + 1);
				value = decodeURIComponent(value);
				args[name] = value;
			}
			return args;
		}

		/**
		 * 动态加载一个样式文件
		 * @param  {[type]} href [description]
		 * @return {[type]}      [description]
		 */
		css : function(href){
			if(!href) return false;
			var head = document.getElementsByTagName('head')[0];
			var link =  document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = href;
			head.appendChild(link);
		}
	}
	window['MALL']['utils'] = utils;
})();

/**
 * 全站通用的jQuery插件
 * @param  {[type]} $        [description]
 * @param  {[type]} document [description]
 * @return {[type]}          [description]
 */
;;;(function($, document){
	/**
	 * 截字功能
	 * $(elem).ellipsis({
	 * 		len : 30
	 * });
	 * 中文字符占：2位
	 * 英文字符占：1位
	 * @param  {[type]} opts [description]
	 * @return {[type]}         [description]
	 */
	$.fn.ellipsis = function(opts){
		var defaults = {
			len : 100,
			txt : '...',
			retult : ''
		}
		var opts = $.extend({}, defaults, opts);
		
		this.each(function(){
			var target_str = $.trim($(this).text()),
				target_len = opts.len,
				retult_txt = opts.retult,
				temp_len = 0,
				i = 0;
			for (i = 0; i < target_str.length; i++){
				if (target_str.charCodeAt(i) > 255){
					temp_len += 2; 
				} else { 
					temp_len++;
				}
				// 将当前内容加到临时字符串 
				retult_txt += target_str.charAt(i);

				// 如果增加计数后长度大于限定长度，就直接返回临时字符串 
				if(temp_len > target_len){
					return $(this).text(retult_txt + opts.txt);
				}
			}
			// 如果全部是单字节字符，就直接返回源字符串 

			return retult_txt;
		});
	}

	/**
	 * 幻灯片轮播功能
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	$.fn.slides = function(opts){
		var def = {
			control : null,
			prev : null,
			next : null,
			current_class : 'current',
			type : 'fade',
			control_event : true,
			slideshow_time : 1000,
			auto : true,
			click_event : true,
			is_stop : true,
			auto_time : 5000,
			delay_time : 300
		}

		var opts = $.extend({}, def, opts);

		var _this = $(this);
		var size = _this.size();
		var control;
		var current_index = 0;
		var index;
		var show_start;
		var show_delay;

		// 初始化
		var init = function(){
			_this.hide().eq(0).show();
		}();

		// 计算当前切换动画
		var calculate = function(){
			if(current_index != index) {
				if(opts.control) {
					$(opts.control).removeClass(opts.current_class).eq(index).addClass(opts.current_class);
				}
			}

			if(opts.slideshow_time <= 0){
				_this.eq(current_index).hide();
				_this.eq(index).show();
			} else if(opts.type == 'fade') {
				_this.eq(current_index).fadeOut(opts.slideshow_time);
				_this.eq(index).fadeIn(opts.slideshow_time);
			}

			current_index = index;
		}

		var go = function(){
			index = (current_index + 1) % size;
			// console.log(index);
			calculate();
		}

		// 点击控制器的时候
		if(opts.control) {
			control = $(opts.control);
			control.removeClass(opts.current_class).eq(0).addClass(opts.current_class);
			control.live('click', function(){
				index = control.index($(this));
				calculate();
				if(opts.click_event) return false;
			});

			if(opts.control_event) {
				control.hover(function(){
					index = control.index($(this));
					show_delay = setTimeout(calculate, opts.delay_time);
				}, function(){
					clearTimeout(show_delay);
				});
			}
		}

		// 下一帧
		if(opts.next) {
			$(opts.next).live('click', function(){
				if(_this.queue().length < 1) {
					go();
				}
				return false;
			});
		}

		// 上一帧
		if(opts.prev) {
			$(opts.prev).live('click', function(){
				if(_this.queue().length < 1) {
					index = (current_index + size - 1) % size;
					calculate();
				}
				return false;
			});
		}

		// 自动执行
		if(opts.auto) {
			show_start = setInterval(go, opts.auto_time);
			if(opts.is_stop) {
				_this.hover(function(){
					clearInterval(show_start);
				}, function(){
					show_start = setInterval(go, opts.auto_time);
				});
			}
		}
	}

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
			MFH.utils.css('/resources/css/dialog.css?v=' + parseInt(new Date().getTime() / 1000));

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