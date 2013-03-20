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
	}
	
	window['MALL']['utils'] = utils;
})();