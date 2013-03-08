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
	
})();