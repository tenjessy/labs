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