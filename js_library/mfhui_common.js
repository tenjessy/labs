/**
 * date:2012-12-20（世界末日的前一天开始编码）
 * explanation:主站一些通用的工具、函数
 */
/**
 * explanation:全局变量
 */
var GLOBAL = {
	timeout : null,
		
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

	/**
	 * 根据当前时间判断是否让QQ显示在线状态
	 * @param {[type]} opts [description]
	 */
	QQStatus : function(opts){
		var opts = opts || {};
		var elem = opts.elem;					// 目标元素
		var online_name = opts.online_name;			// 在线
		var offline_name = opts.offline_name;	// 离线

		// if(!elem || !online_name || !offline_name) return false;

		var hour = MFH.widgets.hours();
		// console.log(hour);

		if(hour >= 21 || hour <= 9){
			elem.addClass(offline_name);
		} else {
			elem.addClass(online_name);
		}
	},

	error : '系统故障，请稍后再试',
	error_parameter : '参数出错，请稍后再试',

	/**
	 * 免邮价格
	 * @type {Number}
	 */
	free_shipping_price : 99,

	step : {
		payment_change : 'change_payment',
		payment_check : 'payment_check'
	},

	mod : {
		avatar : 'user'
	},

	act : {
		avatar : 'setlogo'
	},

	/**
	 * 获取指定范围的随机数组，并且不重复
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	getRandomArray : function(opts){
		var opts = opts || {};
		var total = opts.total;
		var max = opts.max;
		var min = opts.min;
		if(!total || !max) {
			alert(GLOBAL.error_parameter);
			return false;
		}

		var _array = [];
		while(_array.length < total){
			var random_number = parseInt(Math.random() * 1000) % (max + 1);
			if(!distinct(_array, random_number) && random_number >= min){
				_array.push(random_number);
			}
		}

		// 如果怕随机数组有重复
		function distinct(array, random){
			for(var i = 0; i < array.length; i++){
				if(array[i] == random) {
					return true;
				}
			}
			return false;
		}
		return _array;
	},

	/**
	 * 判断用户是否登录
	 * @return {Boolean} [description]
	 */
	isLogined : function(){
		var cookie_username = $.cookie('username');
		var cookie_user_id = $.cookie('user_id');
		var is_logined = false;
		if(cookie_username || cookie_user_id) {
			is_logined = true;
			return is_logined;
		} else {
			return is_logined;
		}
	}
}

/*********************************************************************************************************************************
 * 一些全站通用的jQuery插件
 *********************************************************************************************************************************/

/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
;;;(function ($, document, undefined) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (value === null) {
				options.expires = -1;
			}

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			if (decode(parts.shift()) === key) {
				var cookie = decode(parts.join('='));
				return config.json ? JSON.parse(cookie) : cookie;
			}
		}

		return null;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== null) {
			$.cookie(key, null, options);
			return true;
		}
		return false;
	};
})(jQuery, document);


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

				// 如果增加计数后长度大于限定长度，就直接返回临时字符串 
				if(temp_len > target_len){
					return $(this).html(retult_txt + opts.txt);
				}
				
				// 将当前内容加到临时字符串 
				retult_txt += target_str.charAt(i);
			}
			// 如果全部是单字节字符，就直接返回源字符串 
			return target_str;
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
	 * 下拉菜单
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	$.fn.dropmenu = function(opts){
		var def = {

		}
		var opts = $.extend({}, def, opts);
	}

})(jQuery, document);




/**
 * 全局函数
 * @type {Object}
 */
;;;(function(){
	if(!window.MFH){
		window['MFH'] = {}
	}

	/**
	 * 封装一个ajax请求
	 * type : 请求类型
	 * url : 请求的url
	 * 数据 ：必须为一个对象，而不能像原jQuery里那样的ajax那样，使用字符串
	 * 
	 * @param  {[type]} parameter [description]
	 * @return {[type]}           [description]
	 */
	var ajax = function(parameter){
		var parameter = parameter || {};
		var type = parameter.type;
		var url = parameter.url;
		var data = parameter.data;
		var beforeSend = parameter.beforeSend || function(XMLHttpRequest){};
		var complete = parameter.complete || function(XMLHttpRequest, textStatus){};
		var success = parameter.success || function(response, textStatus, jqXHR){};

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
	window['MFH']['ajax'] = ajax;

	/**
	 * 封闭一个loading效果
	 * 根据opts.type，设定不同的loading
	 * type : 类型，在不同的场合运用不同的loading效果
	 * name : 名称，当前正在加载的数据名称，比如积分商品、购物清单、促销商品
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	var loading = function(opts){
		var opts = opts || {};
		var type = opts.type;
		var name = opts.name || '';
		var tmpl;
		switch(type){
			case 'cart' :
				tmpl = [
					'<div class="ui_loading J_loading">',
						'<s class="icon_loading"></s>正在为您加载' + name + '，请稍后',
					'</div>'
				].join('')
				return tmpl;
				break;
			default :
				tmpl = [
					'<div class="ui_loading J_loading">',
						'<s class="icon_loading"></s>正在为您加载' + name + '，请稍后',
					'</div>'
				].join('');
				return tmpl;
				break;
		}
	}
	window['MFH']['loading'] = loading;

	/**
	 * 小工具
	 * @type {Object}
	 */
	var widgets = {
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
		 * 回到顶部
		 * 为指定元素绑定一个click事件，然后在n毫秒内回到顶部
		 * @return {[type]} [description]
		 */
		top : function(opts){
			// 跨浏览器兼容的scrollTop
			// 为opera
			var $body = (!window.opera) ? $('html, body') : (document.compatMode == 'CSS1Compat' ? $('html') : $('body'));
			$body.animate({ scrollTop: '0px' }, 'slow');
		},

		/**
		 * 随着页面的滚动
		 * 固定某个模块
		 * @param  {[type]} opts 	[参数]
		 * @return {[type]} target 	[目标元素]
		 * @return {[type]} name 	[为目标元素增加一个类名]
		 */
		fixed : function(opts){
			var opts = opts || {};
			var target = opts.target;	// 目标元素
			var name = opts.name;		// 为目标元素增加一个类名

			if(!target.offset()) return;

			var target_offset_top = target.offset().top;

			$(window).scroll(function(){
				var body_scroll_top = $(this).scrollTop();
				if(body_scroll_top > target_offset_top) {
					target.addClass(name);
				} else if(body_scroll_top < target_offset_top) {
					target.removeClass(name);
				};
			});
		},



		/**
		 * 返回当前小时
		 * @return {[type]} [description]
		 */
		hours : function(){
			var today = new Date();
			var hour = today.getHours();
			return hour;
		},


		/**
		 * 返回某天是几月几号
		 * @param  {[type]} opts [description]
		 * @return {[type]}      [description]
		 */
		someday : function(opts){
			var opts = opts || {};
			var days = opts.days || 0;
			var format_date;
			var today = new Date();					// 今天的时间：GMT+0800 ( 中国标准时间 )
			
			today.setDate(today.getDate() + days);
			
			var	year 	= today.getFullYear(),		// 年
				month 	= today.getMonth() + 1,		// 月
				day 	= today.getDate(),			// 日
				hour 	= today.getHours(),			// 时
				minute 	= today.getMinutes(),		// 分
				seconds = today.getSeconds();		// 秒

			format_date = month + '月' + day + '日';
			
			return format_date;
		}
	}
	window['MFH']['widgets'] = widgets;
})();


/**
 * 倒计时功能
 * 传入的参数必须为毫秒数
 * @param  {[type]} elem [目标元素即要将返回的时间插入到哪个DOM元素当中去]
 * @param  {[type]} end_time [结束时间]
 * @usage  {[type]}
 * 
 * var new_countdown = new countdown({
 * 		elem : $('selector'),
 *		end_time : 1361116800
 * });
 * 
 */
var countdown = function(opts){
	this.opts 		= 	opts || {};
	this.elem 		= 	this.opts.elem;
	this.end_time	= 	this.opts.end_time;
	this.init.call(this);
}
countdown.prototype = {
	/**
	 * 初始化
	 * @return {[type]} [description]
	 */
	init : function(){
		this.calculate();
	},

	/**
	 * 计算时间
	 * @return {[type]} [description]
	 */
	calculate : function(){
		if(isNaN(this.end_time)) return false;
		var _this = this;
		var tmpl;

		this.now_time 	= 	parseInt(new Date().getTime() / 1000);

		var diff_time 	= 	this.end_time - this.now_time;
		var day 		= 	parseInt(diff_time / 86400);
		var hour 		= 	parseInt(diff_time / 3600);
		var minute 		= 	parseInt((diff_time - hour * 3600) / 60);
		var seconds 	= 	parseInt(diff_time % 60);

		// console.log(diff_time);
		if(diff_time < 0) {
			tmpl = this.template();
		} else {
			tmpl = this.template({
				hour : hour,
				minute : minute,
				seconds : seconds
			});

			var time_out = setTimeout(function() {
				_this.calculate();
				// console.log(_this);
			}, 1000);
		}
		this.elem.html(tmpl);
	},

	/**
	 * 模板
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	template : function(opts){
		var tmpl;
		if(!opts) {
			var tomorrow = MFH.widgets.someday({
				days : 1
			});
			tmpl = [
				'<span class="tips">今天的特卖活动已结束，请期待' + tomorrow + '的产品</span>'
			].join('');
		} else {
			var hour = opts.hour || 0;
			var minute = opts.minute || 0;
			var seconds = opts.seconds || 0;

			var _this = this;
			tmpl = [
				'<strong class="ui_countdown" data-time="' + _this.end_time + '">',
					'<span class="hh">' + hour + '</span>',
					'<span class="txt">小时</span>',
					'<span class="mm">' + minute + '</span>',
					'<span class="txt">分钟</span>',
					'<span class="ss">' + seconds + '</span>',
					'<span class="txt">秒</span>',
				'</strong>'
			].join('');
		}
		
		return tmpl;
	}
}


/**
 * 用户模块
 * 包括用户是否登陆、个人资料的编辑
 * @type {Object}
 */
var user = {
	mini : function(opts){
		
	},

	/**
	 * [用户头像]
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	avatar : {
		/**
		 * 初始化
		 * 根据设计稿，随机列出系统已有的5个头像
		 * target表示需要随机更换头像的列表的ID名称
		 * @return {[type]} [description]
		 */
		init : function(opts){
			var _this = this;
			var opts = opts || {};
			var id = opts.id;

			var tmpl = this.tmpl();
			var dialog = new uiMFH.dialog({
				width 	: 	'499px',
				height	: 	'288px',
				title 	: 	'修改用户头像',
				content : 	tmpl,
				callback : function(){
					_this.shuffle(id)
				}
			});
			dialog.create();
		},

		/**
		 * 随机列出头像
		 * 默认情况下，由init方法给出头像的范围
		 * 然后通过某个传进的ID进行DOM操作
		 * 这样就可以批量列出相应的头像
		 * @return {[type]} [description]
		 */
		shuffle : function(id){
			var id = $('#' + id);
			var child = id.children();

			var random_array = GLOBAL.getRandomArray({
				total : 5,
				max : 47,
				min : 0
			});
			// console.log(random_array);
			
			var img_src = '/resources/img/avatar/';

			child.each(function(i){
				var _this = $(this);
				_this.find('img').attr('src', img_src + random_array[i] + '.png');
				_this.attr('data-avatar', random_array[i]);
			});
		},

		/**
		 * 更换头像
		 * 当用户选择好某个头像，并提交的时候，该方法异步post一个请求
		 * 需要传递的参数主要有：
		 * 		act=setlogo（当前的动作名称）
		 * 		json=1（返回的是json格式的数据）
		 * @return {[type]} [description]
		 */
		update : function(opts){
			var opts = opts || {};
			var avatar = opts.avatar;
			var target = opts.target;

			if(!avatar){
				alert(GLOBAL.error_parameter);
				return false;
			}

			var url = '/module.php';
			var data = {
				mod 	: 	GLOBAL.mod.avatar,
				act 	: 	GLOBAL.act.avatar,
				logo	: 	avatar,
				json 	: 	1
			}
			// console.log(data);

			MFH.ajax({
				type : 'POST',
				url : url,
				data : data,
				success : success
			});

			function success(response, XMLHttpRequest, jqXHR){
				var response = response,
					avatar = response.logo ? response.logo : '//images/avatar/0.png';
				$('#' + target).attr('src', avatar);
				var dialog = new uiMFH.dialog();
				dialog.close();
			}
		},

		tmpl : function(opts){
			var tmpl = [
				'<div class="dialog_avatar_mod" id="J_dialog_avatar_mod">',
					'<div class="mod_bd">',
						'<p class="pop_info">美肤汇为你推荐系列头像</p>',
						'<div class="custom_avatar">',
							'<ul class="custom_avatar_list" id="J_custom_avatar_list">',
								'<li data-avatar="1" class="current">',
									'<a href="javascript:void(0);"><img src="/resources/img/avatar/1.png" class="avatar_img" alt="头像名称" /></a>',
									'<i class="i">已选中</i>',
								'</li>',
								'<li data-avatar="2">',
									'<a href="javascript:void(0);"><img src="/resources/img/avatar/2.png" class="avatar_img" alt="头像名称" /></a>',
									'<i class="i">已选中</i>',
								'</li>',
								'<li data-avatar="3">',
									'<a href="javascript:void(0);"><img src="/resources/img/avatar/3.png" class="avatar_img" alt="头像名称" /></a>',
									'<i class="i">已选中</i>',
								'</li>',
								'<li data-avatar="4">',
									'<a href="javascript:void(0);"><img src="/resources/img/avatar/4.png" class="avatar_img" alt="头像名称" /></a>',
									'<i class="i">已选中</i>',
								'</li>',
								'<li data-avatar="5">',
									'<a href="javascript:void(0);"><img src="/resources/img/avatar/5.png" class="avatar_img" alt="头像名称" /></a>',
									'<i class="i">已选中</i>',
								'</li>',
							'</ul>',
							'<a href="javascript:void(0);" class="random" id="J_avatar_random">换一批</a>',
						'</div>',
					'</div>',
					'<div class="mod_ft">',
						'<a href="javascript:void(0);" title="确定修改" class="btn_submit" id="J_avatar_submit">修　改</a>',
						'<a href="javascript:void(0);" title="取消修改" class="btn_cancel">取消</a>',
					'</div>',
				'</div>'
			].join('');
			return tmpl;
		}
	},

	/***********************************************************************
	 * 下面是一些初始化HTMl模板
	 ***********************************************************************/

	/**
	 * 已经登录的模板
	 * @return {[tmpl]} [返回模板对象]
	 */
	template : function(opts){
		var opts 		= 	opts || {};
		var status 		= 	opts.status;						// 状态：登录？未登录		
		var order 		= 	opts.order;							// 订单对象
		var paid 		= 	order && opts.order.paid;			// 已付款订单
		var unpaid 		= 	order && opts.order.not_paid;		// 未付款订单
		var collect 	= 	opts.collect;						// 收藏
		var coupon 		= 	opts.bonus;							// 优惠券
		var credit 		= 	opts.credit;						// 积分
		var welfare 	= 	opts.welfare_num;					// 福利社

		var title 		= 	status ? '<span class="hd_t">登录可获取<strong class="num">1</strong>积分</span><a href="user.php" class="act">登录</a>' : '<strong class="hd_t">你好，某某同学</strong>';
		var paid_qty 	= 	paid ? '(<b>' + paid + '</b>)' : '';
		var unpaid_qty 	= 	unpaid ? '(<b>' + unpaid + '</b>)' : '';
		var credit_qty 	= 	credit ? '(<b>' + credit + '</b>)' : '';
		var collect_qty = 	collect ? '(<b>' + collect + '</b>)' : '';
		var coupon_qty 	= 	coupon ? '(<b>' + coupon + '</b>)' : '';
		var welfare_qty = 	welfare ? '<b>' + welfare + '</b>' : '';

		var tmpl = [
			'<div class="dropdown_menu dropdown_profile" id="J_dropdown_profile">',
				'<div class="menu_hd">' + title + '</div>',
				'<div class="menu_bd">',
					'<ul class="profile_list">',
						'<li><a href="/user.php?act=order_list&order_status=1">待付款订单' + unpaid_qty + '</a></li>',
						'<li><a href="/user.php?act=order_list&order_status=2">已付款订单' + paid_qty + '</a></li>',
						'<li><a href="/module.php?mod=credit">我的积分' + credit_qty + '</a></li>',
						'<li><a href="/user.php?act=collection_list">我的收藏' + collect_qty + '</a></li>',
						'<li><a href="/magic.php">查看膜法盒</a></li>',
						'<li><a href="/user.php?act=bonus">我的优惠券' + coupon_qty + '</a></li>',
						'<li><a href="/module.php?mod=user&act=welfare">我的福利社' + welfare_qty + '</a></li>',
						'<li><a href="/reviews/mygoods">我的晒货</a></li>',
					'</ul>',
				'</div>',
			'</div>'
		].join('');
		return tmpl;
	}
}

/**
 * 购物车的增、删、改、查
 * 
 * @param {[type]} extension_code [商品类型，主要包括以下几种类型]
 * @param {[type]} package_buy:礼包
 * @param {[type]} exchange_lottery:积分抽奖
 * @param {[type]} exchange_credit:积分兑换
 * @param {[type]} outtime_cart_goods:过期商品
 * @param {[type]} general_goods:默认（普通商品）
 *
 *
 * 
 */
var cart = {
	/**
	 * 初始化
	 * 在购物车页面加载完成后，优先显示已经加入购物车的数据
	 * 然后再显示可兑换的商品
	 * 再显示礼包、活动等相关数据
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	init : function(opts){

		// 在初始化之前，把相应的loading插入到页面当中
		// 插入loading

		// 然后配置相应的参数
		opts = opts || {};
		site = opts.site;
		var url = 'flow.php?step=get_cart_goods';
		
		MFH.ajax({
			type : 'GET',
			url : url,
			beforeSend : before,
			complete : complete,
			success : success
		});

		function before(XMLHttpRequest){
			// 在摘取购物清单之前，先把一个loading效果插入到页面当中
			var tmpl_loading = MFH.loading();
		}
		function complete(XMLHttpRequest, textStatus){}
		function success(response, textStatus, jqXHR){
			var response = $.parseJSON(response);
			// 调用渲染购物车页面的方法
			cart.rendering(response);
		}


		// 尝试拉取礼数据
		// var _data = {
		// 	mod : 'cart',
		// 	act : 'get_gift'
		// }
		// MFH.ajax({
		// 	type : 'GET',
		// 	url : '/module.php',
		// 	data : _data,
		// 	success : giftSuccess
		// });

		function giftSuccess(response, textStatus, jqXHR){
			// 判断是否有错
			if( response.err != 0 ) {
				alert(response.msg);
				return false;
			}
			cart.createGift(response);
		}
	},

	/**
	 * 渲染购物车的页面
	 * @param  {[type]} goods [description]
	 * goods参数里面包含两个非常重要的对象
	 * var total = goods.total [当前购物车的一些统计信息，包括总价、节省、邮费]
	 * var list = goods.goods_list [当前购物车的商品清单信息]
	 */
	rendering : function(goods){
		// 清除商品清单当中的loading
		// 清除loading
		if(goods == undefined) return false;

		var total 			= 	goods.total;				// 购物车的总计信息
		var list 			= 	goods.goods_list;			// 购物车的商品列表
		var goods_out_time 	= 	goods.outtime_cart_goods;	// 购物车的过期商品
		var goods_gifts 	=	goods.next_level_goods;		// 购物累计满多少元后，会有N份礼品

		// 计算当前商品的价格，以便判断是否包邮
		// 方便在后面显示包邮信息和需要加购多少钱才能包邮
		var total_price 		= 	parseFloat(total.goods_price);										// 当前购买商品的总费用
		var total_credit 		= 	Math.ceil(total_price);												// 当前获赠总积分
		var total_saving		= 	total.saving;														// 共节省了多少钱

		var shipping_fee 		= 	parseInt(total.shipping_fee);										// 当前运费
		var difference_price 	= 	Math.abs((total_price - GLOBAL.free_shipping_price)).toFixed(2);	// 差价（用于再加购多少钱就可以包邮）
		var not_shipping_tips 	= 	'您的订单未满99元，再加购<b class="rmb">&yen;</b><strong class="price">' + Math.abs( difference_price ) + '</strong>即可享受包邮服务！';
		var shipping_tips 		= 	'您的订单已享受包邮服务！';

		// 如果“当前运费”不等于0
		if(shipping_fee == 0){

		}
		// 如果“当前运费”不等于0
		else {

		}
		// 判断当前是否有商品
		var list_length = list.length;

		// 如果没有商品，插入ui_empty_mod模块
		if(list_length == 0){
			// 没有商品的模板

			return false
		}


		// 如果有商品
		// 为购物车总计的dom赋值
		$('#total_goods_amount').text(total_price);
		$('#total_credit').text(total_credit);


		// 循环list对象当中的商品列表，
		// 然后根据相应的商品类型，输出相应的html模板，再把模板插入到购物车商品清单的列表当中
		// 在这个过程当中，记得要判断商品是否过期、是否为一元加购商品
		for(var i = 0; i < list_length; i++){
			cart.createGoodsRow(list[i]);
		}
	},

	/**
	 * 创建单个商品数据
	 * 该方法需要根据extension_code来创建不同类型的模板
	 * @param  {[type]} goods [description]
	 * @return {[type]}       [description]
	 */
	createGoodsRow : function(goods){
		if(!goods){
			alert('参数错误');
			return false;
		}

		var extension_code = goods.extension_code;
		var tmpl;
		switch(extension_code){
			/**
			 * 组合套餐
			 */
			case 'package_buy' :
				console.log(package_buy);
				break;
			/**
			 * 积分抽奖
			 */
			case 'exchange_lottery' :
				console.log('exchange_lottery');
				break;
			/**
			 * 积分兑换
			 */
			case 'exchange_credit' :
				console.log('exchange_credit');
				break;
			/**
			 * 过期商品
			 */
			case 'outtime_cart_goods' :
				console.log('outtime_cart_goods');
				break;
			default :
				tmpl = cart.template(goods);
				$('#cart_goods_table .tbody').append(tmpl);
				break;
		}
	},

	/**
	 * 积分商品数据
	 * @return {[type]} [description]
	 */
	createCreditGoods : function(){
		// 清除积分商品数据当中的loading
		// 清除loading
	},

	/**
	 * 礼包数据
	 * @return {[type]} [description]
	 */
	createGift : function(){
		// 清除礼包数据当中的loading
		// 清除loading
	},

	/**
	 * 最大购物数量
	 * @return {[type]} [description]
	 */
	getMaxBuyQuantity : function(){
		var max_buy = parseInt($('.J_max_buy').val()) || 50;
		return max_buy;
	},


	/**
	 * 修改购物车的购买数量
	 * @return {[type]} [description]
	 */
	change : function(opts){
		var opts = opts || {}
		var rec_id = opts.rec_id;
		var goods_number = parseInt(opts.goods_number);
		var parents = opts.parents;
		var parent = opts.parent;
		var type = opts.type || 'changed';
		var result_goods_number;
		
		var max_buy = cart.getMaxBuyQuantity();

		// 判断当前是需要增加还是减少
		// 并计算操作后的结果
		switch(type){
			case 'add' :
				result_goods_number = goods_number + 1;
				if(result_goods_number > max_buy){
					alert('每人限购 ' + max_buy + ' 件，敬请谅解!');
					parent.find('a.add').attr('data-operate', 'dont');
					return false;;
				}
				break;
			case 'reduce' :
				result_goods_number = goods_number - 1;
				if(result_goods_number == 0) return false;
				if(result_goods_number < max_buy){
					parent.find('a.add').attr('data-operate', 'add');
				}
				break;
			default :
				if(isNaN(goods_number)){
					alert('请输入正确的数字');
					parent.find('input.J_amount').val('1');
					return false;
				}
				break;
		}
		parent.find('input.J_amount').val(result_goods_number);

		var url = 'flow.php';
		var data = {
			step : 'update_cart_json',
			rec_id : rec_id,
			goods_number : result_goods_number
		}

		MFH.ajax({
			type : 'POST',
			url : url,
			data : data,
			success : success
		});

		function success(response, textStatus, jqXHR){
			var response = $.parseJSON(response);
			console.log(response);
			var err = response && response.err;
			var msg = response && response.msg;
			if(err != 0){
				alert(msg);
				parent.find('input.J_amount').val(goods_number);
				return false;
			}
			cart.update(response);
		};
	},

	/**
	 * 更新购物车
	 * 这里执行的渲染返回的json数据
	 * 在change方法里面，传递过来的有两个对象：
	 * info:当前修改的商品的信息
	 * total:购物车的总计信息
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	update : function(opts){
		if(!opts) return false;

		var total 				= opts.total;	// 购物车的总计信息
		var info 				= opts.info;	// 当前修改的商品的信息

		////////////////// 当前需要更新的商品信息 /////////////////
		var goods_id 			= info.goods_id;		// 商品ID
		var goods_number 		= info.goods_number;	// 购买数量
		var goods_price 		= info.goods_price;		// 商品价格
		var goods_total 		= info.subtotal;		// 商品小计

		// 为当前修改的商品的dom赋值
		var parent = $('.shopping_item[data-id=' + goods_id + ']');
		parent.find('.J_amount').val(goods_number);
		parent.find('.price_total').text(goods_total);

		////////////////// 整个购物车信息 //////////////////
		var total_price = total.goods_price;
		var total_credit = Math.ceil(total_price);

		// 为购物车总计的dom赋值
		$('#total_goods_amount').text(total_price);
		$('#total_credit').text(total_credit);	
	},

	/**
	 * 删除购物车当中的某个商品
	 * 必须指定商品ID
	 * @param  {[type]} opts  [description]
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	del : function(opts){
		var is_confirm = window.confirm('确认不购买此商品：（');
		if(!is_confirm) return false;

		var opts = opts || {};
		var id = opts.id;

		var url = 'flow.php?step=drop_goods&id=' + id;

		var data = {
			step : 'drop_goods',
			id : id
		}

		MFH.ajax({
			type : 'POST',
			url : url,
			success : success
		});

		function success(response, textStatus, jqXHR){
			// 成功后，更新购物车的总计信息
		}
	},

	/***********************************************************************
	 * 下面是一些初始化HTMl模板
	 ***********************************************************************/

	/**
	 * 商品清单的模板
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	template : function(opts){
		var opts 		= 	opts || {};
		var goods_id 	= 	opts.goods_id;
		var rec_id 		= 	opts.rec_id;
		var goods_thumb = 	opts.goods_thumb;
		var goods_name 	= 	opts.goods_name;
		var goods_price = 	opts.goods_price;
		var goods_total	= 	opts.subtotal;
		var qty 		= 	opts.goods_number;

		var url = '/goods-' + goods_id + '.html';

		var tmpl = [
			'<tr class="shopping_item" data-recid="' + rec_id + '" data-id="' + goods_id + '">',
				'<td class="goods_pic">',
					'<a href="' + url + '" target="_blank"><img src="' + goods_thumb + '" alt="' + goods_name + '" title="' + goods_name + '" class="goods_img" /></a>',
				'</td>',
				'<td class="goods_name">',
					'<a href="' + url + '" target="_blank">' + goods_name + '</a>',
				'</td>',
				'<td class="goods_qty">',
					'<span class="change_quantity J_change_quantity">',
						'<a href="javascript:void(0);" class="reduce" data-operate="reduce">-</a>',
						'<input type="text" class="amount J_amount" value="' + qty + '" />',
						'<input type="hidden" class="J_max_buy" value="">',
						'<a href="javascript:void(0);" class="add" data-operate="add">+</a>',
					'</span>',
				'</td>',
				'<td class="goods_price">',
					'&yen;<strong class="price_now">' + goods_price + '</strong>元',
				'</td>',
				'<td class="goods_total">',
					'&yen;<strong class="price_total">' + goods_total + '</strong>元',
				'</td>',
				'<td class="goods_operate">',
					'<a href="javascript:void(0);" class="del" title="确认不购买此商品：（">删除</a>',
				'</td>',
			'</tr>'
		].join('');
		return tmpl;
	}
}

/**
 * 结算页面
 * @type {Object}
 */
var checkout = {
	/**
	 * 检测当前优惠券是否可用
	 * 并且根据结果判断是否包邮
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	coupon : function(opts){
		var opts = opts || {};
		var sn = opts.sn;
		var reuse = opts.reuse || 0;
		var input = opts.input || $('#J_coupon_input');

		if(!sn){
			alert('请输入优惠券序列号');
			input.focus();
			return false;
		}
		var url = 'flow.php';
		var data = {
			step : 'validate_bonus',
			reuse : reuse,
			bonus_sn : sn
		}

		MFH.ajax({
			type : 'POST',
			url : url,
			data : data,
			success : success
		});

		function success(response, XMLHttpRequest, jqXHR){
			var response = $.parseJSON(response);

			////////////////// 优惠券价格 //////////////////
			var coupon_price 		= 	response.bonus;	// 优惠价格

			////////////////// 整个购物车信息 //////////////////
			var total_price = response.goods_price;		// 购物车的商品总价
			var total_amount = response.amount;			// 此次购物应付价格（因为使用了优惠券后，价格会相应改变）
			var market_price = response.market_price;	// 市场价格

			// 运费信息
			var shipping_fee 		= 	parseInt(response.shipping_fee);										// 当前运费
			var difference_price 	= 	Math.abs((total_amount - GLOBAL.free_shipping_price)).toFixed(2);		// 差价（用于再加购多少钱就可以包邮）
			var not_shipping_tips 	= 	'您的订单未满99元，再加购<b class="rmb">&yen;</b><strong class="price">' + Math.abs( difference_price ) + '</strong>即可享受包邮服务！';
			var shipping_tips 		= 	'您的订单已享受包邮服务！';

			var coupon_tips = [
				'<div class="coupon_tips" id="J_coupon_tips">',
					'已成功抵扣：<strong class="coupon_price">' + coupon_price + '元</strong>',
					'<strong class="price">（优惠券不可抵消运费）</strong>',
				'</div>'
			].join('');

			// 错误信息
			var error = response && response.error;
			var msg = response && response.message;

			// 判断优惠券是否已经使用
			// 同时，判断是否已经过期
			// 
			// 先判断是否已经使用
			// 在使用的时候，提示用户是否覆盖之前的订单
			var is_confirm = response && response.confirm;			// 返回的json当中，该键的值是1
			if(is_confirm) {
				var is_confirm_tips = confirm( error + '\n' + msg );
				if(is_confirm_tips){
					checkout.coupon({
						sn : response.bonus_sn,
						reuse : 1
					});
					return false;
				}
			}
			// 然后再判断是否有其它的错误，比如是否在有效期内
			else if(error) {

			}
			// 如果上面两个判断都不成立，则恭喜您！可以使用该优惠券了
			else {

			}

		}
	}
}

/**
 * 付款
 * @type {Object}
 */
var orders = {
	/**
	 * 修改付款方式
	 * step:接下来，需要进行的某个步骤
	 * pay_id:付款方式的标记，比如财付通、支付宝、普通银行[目前就三个值：1(tenpay), 2(alipay), 9999]
	 * bank_type:付款的银行；[目前有多个值：tenpay, alipay, 各个银行的标识（4个数字组成）]
	 * order_sn:订单编号；
	 * 
	 * 目前的情况是这样的：
	 * 		如果选择了某个银行，则pay_id的值默认是9999，bank_type则是相应的银行ID
	 * 		在点立即付款的时候，会跳到财付通，然后财付通根据bank_type自行判断需要跳到哪个银行支付
	 *
	 * 		如果选择了财付通 or 支付宝，则pay_id的值则相应的value，比如财付通的value是1，支付宝的value是2
	 * 		而此时，bank_type则为0
	 * @return {[type]} [description]
	 */
	changed : function(opts){
		var opts = opts || {},
			target = opts.target,										// 目标元素
			pay_id = opts.pay_id,										// 付款方式的标记
			bank_type = opts.bank_type,									// 付款的银行
			order_sn = opts.order_sn,									// 订单编号
			bank_type_elem = opts.bank_type_elem || $('#J_bank_type');	// 存储银行标记的元素[根据不同的pay_id进行判断]

		if(!pay_id || !bank_type || !order_sn) {
			alert(GLOBAL.error_parameter);
			return false;
		}

		// 更改当前所选择的支付方式的UI
		target.addClass('current').siblings().removeClass('current');
		target.parent().find('input[name="payment"]').removeAttr('checked');
		target.find('input[name="payment"]').attr('checked', true);

		// 同时，修改当前支付的银行的图片



		// 如果没有选择银行，而是选择了第三方支付平台的话
		if(isNaN(bank_type)) bank_type = 0;

		// 为当前行选择的银行进行赋值，方便在点击确认付款的时候，进行表单提交
		bank_type_elem.val(bank_type);

		// 一些ajax必要的参数
		var url = '/flow.php';
		var data = {
			step : GLOBAL.step.payment_change,
			pay_id : pay_id,
			bank_type : bank_type,
			order_sn : order_sn
		}
		// console.log(data);

		MFH.ajax({
			type : 'POST',
			url : url,
			data : data,
			success : success
		});

		function success(response, XMLHttpRequest, jqXHR){
			var response = $.parseJSON(response);
			var error = response && response.error;
			if(error != 0) {
				alert(GLOBAL.error);
			}

			var content = response && response.content;

			// 这个form是由服务器端返回的
			$('form[name=theform]').replaceWith(content);
		}
	},


	/**
	 * 在点支付的时候，需要验证一下form[name=theform]是否正确
	 * step:接下来，需要进行的某个步骤
	 * order_sn:订单编号（无论如何，想办法拿到这个参数，并传过去）
	 *
	 * 目前存在的问题：
	 * 		如果在ajax的callback当中进行submit()的话，浏览器会阻止新窗口打开(Fuck)；
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	check : function(opts){
		var opts = opts || {};
		var order_sn = opts.order_sn;
		if(!order_sn) {
			alert(GLOBAL.error);
			return false;
		}

		var url = '/flow.php';

		var data = {
			step : GLOBAL.step.payment_check,
			order_sn : order_sn
		}

		MFH.ajax({
			type : 'POST',
			url : url,
			data : data,
			success : success
		});

		function success(response, XMLHttpRequest, jqXHR){
			var response = $.parseJSON(response);
			var error = response && response.error;
			var content = response && response.content;

			if(error != 0){
				alert(content);
				return false;
			} else {
				$('form[name=theform]').submit();
			}
			// console.log(response);
		}
	}
}






/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 实例化
/////////////////////////////////////////////////////////////////////////////////////////////////////////

$(function(){
	// slides
	$('#J_promotion_ad_mod .promotion_ad_list li').slides({
		control : '#J_promotion_ad_mod .control b'
	});

	// 倒计时
	var t1 = new countdown({
		elem : $('.J_spltimer_1'),
		end_time : 1361203200
	});

	var t2 = new countdown({
		elem : $('.J_spltimer_2'),
		end_time : 1361116500
	});



	// 收藏本站
	$('#J_collect_site').live('click', function(){
		MFH.widgets.bookmark();
		return false;
	});

	// QQ在线状态
	GLOBAL.QQStatus({
		elem : $('.J_QQ_status'),
		online_name : 'qq_online',
		offline_name : 'qq_not_online'
	});

	// 回到顶部
	$('#J_jump_top').live('click', function(){
		MFH.widgets.top();
		return false;
	});

	// 固定导航条
	MFH.widgets.fixed({
		target : $('.detail_menu_mod'),
		name : 'ui_fixed'
	});


	// 购物车
	cart.init();

	// 删除购物车当中的某个商品
	$('#cart_goods_table .del').live('click', function(){
		var id = $(this).parents('.shopping_item').attr('data-recid');
		var opts = {
			id : id
		}
		cart.del(opts);
		return false;
	});

	// 修改购物车当中的某个商品的购买数量
	$('.J_change_quantity a[data-operate]').live('click', function(){
		var $this = $(this);
		var $parents = $this.parents('tr');
		var $parent = $this.parent();
		var type = $this.attr('data-operate');

		var rec_id = $parents.attr('data-recid');
		var goods_number = $.trim($parent.find('input.J_amount').val());
		var opts = {
			type : type,
			parents : $parents,
			parent : $parent,
			rec_id : rec_id,
			goods_number : goods_number
		}
		cart.change(opts);
		return false;
	});

	$('.J_change_quantity input.J_amount').live('change', function(){
		var $this = $(this);
		var $parents = $this.parents('tr');
		var $parent = $this.parent();

		var rec_id = $parents.attr('data-recid');
		var goods_number = $.trim($this.val());
		var opts = {
			parents : $parents,
			parent : $parent,
			rec_id : rec_id,
			goods_number : goods_number
		}
		cart.change(opts);
		return false;
	});


	// 结算页面
	$('#J_validate_coupon').live('click', function(){
		var sn = $.trim($('#J_coupon_input').val());
		var input = $('#J_coupon_input');
		var opts = {
			sn : sn,
			input : input
		}
		checkout.coupon(opts);
		return false;
	});


	// 修改付款方式
	$('#J_payment_mod li[class!=current]').live('click', function(e){
		var target = $(this);
		var pay_id = target.find('input[name=payment]').val();
		var bank_type = target.find('input[name=payment]').attr('data-bank');
		var order_sn = target.parent().parent().attr('data-sn');
		var bank_type_elem = $('#J_bank_type');
		var opts = {
			target : target,
			pay_id : pay_id,
			bank_type : bank_type,
			order_sn : order_sn,
			bank_type_elem : bank_type_elem
		}
		orders.changed(opts);
		// GLOBAL.preventDefault(e);
	});

	// 确认付款
	$('.ui_btn_pay').live('click', function(e){
		// $('form[name=theform]').submit();
		// return false;
		var order_sn = $('.pay_form').attr('data-sn');
		var opts = {
			order_sn : order_sn
		}
		orders.check(opts);
		GLOBAL.stopPropagation(e);
	});


	/**
	 * 个人资料
	 */
	$('.main_area').live('click', function(){
		user.mini();
	});

	/**
	 * 实体：更改用户头像
	 * @return {[type]} [description]
	 */
	// 发起更改的需求
	$('#J_edit_avatar').live('click', function(){
		var id = 'J_custom_avatar_list';
		var opts = {
			id : id
		}
		user.avatar.init(opts);
	});
	// 随机列出头像
	$('#J_avatar_random').live('click', function(){
		var id = 'J_custom_avatar_list';
		user.avatar.shuffle(id);
		return false;
	});
	// 确认修改头像
	$('#J_avatar_submit').live('click', function(){
		var avatar = $('#J_custom_avatar_list .current').attr('data-avatar');
		var target = 'J_user_avatar_img';
		user.avatar.update({
			avatar : avatar,
			target : target
		});
	});
});