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


/********************************************************************************
 * 常用的jQuery插件
 * @return {[type]} [description]
 ********************************************************************************/
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
		console.log(opts);
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
})(jQuery, document);