;;;(function(){
	if(!window.Widget){
		window['Widget'] = {}
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
	window['Widget']['countdown'] = countdown;
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