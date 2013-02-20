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

;;;(function(){
	if(!window.MFH){
		window['MFH'] = {}
	}

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
					'<strong class="ui_countdown">',
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
	window['MFH']['countdown'] = countdown;
})();


;;;(function($, document){
	/**
	 * 倒计时功能
	 * 传入的参数必须为毫秒数
	 * @param  {[type]} elem [目标元素即要将返回的时间插入到哪个DOM元素当中去]
	 * @param  {[type]} end_time [结束时间]
	 * @usage  {[type]}
	 * 
	 * $.countdown({
	 * 		elem : $('selector'),
	 *		end_time : 1361116800
	 * });
	 * 
	 */
	$.countdown = function(){
		var def = {
			elem : null,
			end_time : 0
		}
		var self = this;
		var opts = {};
		var _opts = {};

		if (typeof arguments[0] == 'object' || typeof arguments[1] == 'object') {
			_opts = $.extend(_opts, (typeof arguments[0] == 'object' ? arguments[0] : arguments[1]));
		}

		opts = $.extend({}, def, _opts);

		self.init = function(){
			self.calculate(opts);
		}

		self.calculate = function(){
			if(isNaN(opts.end_time)) return false;
			var tmpl;

			opts.now_time 	= 	parseInt(new Date().getTime() / 1000);

			var diff_time 	= 	opts.end_time - opts.now_time;
			var day 		= 	parseInt(diff_time / 86400);
			var hour 		= 	parseInt(diff_time / 3600);
			var minute 		= 	parseInt((diff_time - hour * 3600) / 60);
			var seconds 	= 	parseInt(diff_time % 60);

			// console.log(diff_time);
			if(diff_time < 0) {
				tmpl = self.template();
			} else {
				tmpl = self.template({
					hour : hour,
					minute : minute,
					seconds : seconds
				});

				var time_out = setTimeout(function() {
					self.calculate();
				}, 1000);
			}
			opts.elem.html(tmpl);
		}

		self.template = function(args){
			var tmpl;
			if(!args) {
				var tomorrow = MFH.widgets.someday({
					days : 1
				});
				tmpl = [
					'<span class="tips">今天的特卖活动已结束，请期待' + tomorrow + '的产品</span>'
				].join('');
			} else {
				var hour = args.hour || 0;
				var minute = args.minute || 0;
				var seconds = args.seconds || 0;

				var _this = this;
				tmpl = [
					'<strong class="ui_countdown">',
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

		return self.init();
	}
})(jQuery, document);