/**
 * update:2013-06-16 23:12
 * author:tenjessy@gmail.com
 * 
 * 在微信平台webview的一些JavaScript接口实现
 * 该接口以javascript到客户端的接口 桥WeixinJSBridge形式提供
 * WeixinJSBridge.invoke(‘服务名称’,{调用参数},<回调函数>);
 * 比如：关注微信号、分享到微博、分享到朋友圈、分享给朋友等功能；
 *
 * 下面的代码会有涉及到一些百度统计的相关API，比如
 * _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
 * 这个是百度事件跟踪API，具体的可以参考这里：http://hi.baidu.com/bdtongji/item/a4e55ddfacd83cbd32db9062
 *
 *
 * update:这个功能在微信公众平台没有调整政策之前是可以使用的，但调整之后能否使用，就不清楚了！！！
 */


;;;(function(){
	if(!window.widget){
		window.widget = {}
	}


	/**
	 * 微信webview的一些JavaScript接口实现
	 * 
	 * 在命名方面，最好在自己项目的基础上结合微信的命名方法，这样方便自己，也方便项目组的其它同事；
	 * 举个例子，下面是微信JS API给出的相关接口名称：
	 *
	 * sendAppMessage : 发送app消息
	 * profile : 查看用户profile
	 * shareWeibo : 分享到微薄
	 * shareTimeline : 分享到朋友圈
	 * addContact : 添加联系人
	 * imagePreview : 调用微信内置的图片浏览
	 * 
	 * @type {Object}
	 */
	var weixin = {
		msgAlertTips : '请在微信里访问 :)',
		/**
		 * 关注微信号
		 * wxid：这个微信ID在最初的时候应该是由微信平台自动生成的微信id串
		 * 一般来说，这个id是没有直接对外公开的；
		 * 后来，听说又可以直接使用微信昵称作为wxid这个参数的值进行传递，具体我没有测试过
		 * @return {[type]} [description]
		 */
		addContact : function(options){
			var options = options || {};
			var wxid = options.wxid || wxid;
			var that = this;

			if (typeof WeixinJSBridge !== "undefined") {
				WeixinJSBridge.invoke('addContact', {
					"webtype": "1",
					"username": wxid
				},function(res){
					// 官方示例当中，默认的返回示例
					// 返回res.err_msg,取值
					// send_app_msg:cancel 用户取消
					// send_app_msg:fail 发送失败 
					// send_app_msg:ok 发送成功
					WeixinJSBridge.log(res.err_msg);

					if (res.err_msg.search('ok') != -1 || res.err_msg.search('confirm') != -1){
						_hmt.push(['_trackEvent', '在(' + site + ')关注微信号(' + wx_map[wxid] + ')', '关注微信号', wx_map[wxid], 1]);
						_hmt.push(['_trackEvent', site, '关注微信号', wx_map[wxid], 1]);
					} else {
						_hmt.push(['_trackEvent', '在(' + site + ')取消关注微信号(' + wx_map[wxid] + ')', '取消关注微信号', wx_map[wxid], 0]);
						_hmt.push(['_trackEvent', site, '取消关注微信号', wx_map[wxid], 0]);
					}
				});
			} else {
				alert(that.msgAlertTips);
			}
		},

		/**
		 * 分享到微博
		 *
		 * 目前网上大部分的分享API都是基于URL进行传递参数的，比如微博、QQ闹钟等，微信webview也不例外
		 * 主要的参数有：
		 * 		content : 微信分享到微博的内容
		 * 		url : 需要跳转的url
		 *
		 * 这里的wxid不是必要的参数，我在这里示例代码里写进去，是为了项目需要统计一些信息
		 * 最开始的时候，在webview分享到微博的时候，貌似是不能附加图片的，后来就不清楚了
		 * 
		 * 
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		shareWeibo : function(options){
			var options = options || {};
			var wxid = options.wxid || wxid;
			var that = this;

			if (typeof WeixinJSBridge !== "undefined") {

				var content = '这里是分享到微博的具体内容';
				var url = '这里是需要跳转的URL，如果有中文的话，需要进行encodeURIComponent加密';

				WeixinJSBridge.invoke('shareWeibo',{
					'content' : "#微信分享# " + content,  // 分享到微薄的内容
					'url' : url // 分享连接地址
				},function(res){
					// 官方示例当中，默认的返回示例
					// 返回res.err_msg,取值
					// send_app_msg:cancel 用户取消
					// send_app_msg:fail 发送失败 
					// send_app_msg:ok 发送成功
					WeixinJSBridge.log(res.err_msg);

					if (res.err_msg.search('ok') != -1 || res.err_msg.search('confirm') != -1){
						_hmt.push(['_trackEvent', '在(' + site + ')分享到微博', '分享到微博', wx_map[wxid], 1]);
						_hmt.push(['_trackEvent', site, '分享到微博', wx_map[wxid], 1]);
					} else {
						_hmt.push(['_trackEvent', '在(' + site + ')取消分享到微博', '取消分享到微博', wx_map[wxid], 0]);
						_hmt.push(['_trackEvent', site, '取消分享到微博', wx_map[wxid], 0]);
					}
				});
			} else {
				alert(that.msgAlertTips);
			}
		},

		/**
		 * 分享到朋友圈
		 *
		 * 之前微信要整治朋友圈，也是因为有蘑菇街跟我公司一些小项目导致朋友圈大量的垃圾信息
		 * 据说整治后，不能在webview当中放置一些分享到朋友圈的相关按钮了，只能靠用户自己点右上角微信自己的分享按钮
		 *
		 * 具体的内容格式需要传递以下几个参数：
		 * 		title : 标题
		 * 		img_url : 图片URL，这个图片一般是会出现在左边的
		 * 		link : 链接，当用户点击链接的时候，进行跳转
		 * 		desc : 描述，这个默认是放在右边的，跟图片并排
		 * 		
		 * 最开始我测试的时候，这几个参数省一不可，但就算有些值为undefind也是可以正常分享友朋友圈的；
		 * 其中还有一些参数：
		 * 		img_width : 图片宽度
		 * 		img_height : 图片高度
		 *
		 * 
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		shareTimeline : function(options){
			var options = options || {};
			var wxid = options.wxid || wxid;
			var that = this;

			if (typeof WeixinJSBridge !== "undefined") {

				var title = 'Tiis is Title';
				var img_url = 'This is the image link';
				var link = 'This is the message link';
				var desc = 'This is the message description';
				
				WeixinJSBridge.invoke('shareTimeline',{
					'img_url' 		: img_url,
					'link' 			: link,
					'desc' 			: desc,
					'title' 		: title
				}, function(res) {
					// 官方示例当中，默认的返回示例
					// 返回res.err_msg,取值
					// send_app_msg:cancel 用户取消
					// send_app_msg:fail 发送失败 
					// send_app_msg:ok 发送成功
					WeixinJSBridge.log(res.err_msg);

					if (res.err_msg.search('ok') != -1 || res.err_msg.search('confirm') != -1){
						_hmt.push(['_trackEvent', '在(' + site + ')分享到朋友圈', '分享到朋友圈', wx_map[wxid], 1]);
						_hmt.push(['_trackEvent', site, '分享到朋友圈', wx_map[wxid], 1]);
					} else {
						_hmt.push(['_trackEvent', '在(' + site + ')取消分享到朋友圈', '取消分享到朋友圈', wx_map[wxid], 0]);
						_hmt.push(['_trackEvent', site, '取消分享到朋友圈', wx_map[wxid], 0]);
					}
				});
			} else {
				alert(that.msgAlertTips);
			}
		},

		/**
		 * 分享给朋友
		 * 
		 * 最早的时候，分享到朋友圈，只能是一条信息一个内容的，而不能像公众平台那样，一条信息里面写N多条新闻
		 * 具体的内容格式需要传递以下几个参数：
		 * 		title : 标题
		 * 		img_url : 图片URL，这个图片一般是会出现在左边的
		 * 		link : 链接，当用户点击链接的时候，进行跳转
		 * 		desc : 描述，这个默认是放在右边的，跟图片并排
		 * 		
		 * 最开始我测试的时候，这几个参数省一不可，但就算有些值为undefind也是可以正常分享友朋友圈的；
		 * 其中还有一些参数：
		 * 		img_width : 图片宽度
		 * 		img_height : 图片高度
		 *
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		sendAppMessage : function(options){
			var options = options || {};
			var wxid = options.wxid || wxid;
			var that = this;

			if (typeof WeixinJSBridge !== "undefined") {

				var title = 'Tiis is Title';
				var img_url = 'This is the image link';
				var link = 'This is the message link';
				var desc = 'This is the message description';
				
				WeixinJSBridge.invoke('sendAppMessage',{
					'img_url' 		: img_url,
					'link' 			: link,
					'desc' 			: desc,
					'title' 		: title
				},function(res){
					// 官方示例当中，默认的返回示例
					// 返回res.err_msg,取值
					// send_app_msg:cancel 用户取消
					// send_app_msg:fail 发送失败 
					// send_app_msg:ok 发送成功
					WeixinJSBridge.log(res.err_msg);

					if (res.err_msg.search('ok') != -1 || res.err_msg.search('confirm') != -1){
						_hmt.push(['_trackEvent', '在(' + site + ')分享给朋友', '分享给朋友', wx_map[wxid], 1]);
						_hmt.push(['_trackEvent', site, '分享给朋友', wx_map[wxid], 1]);
					} else {
						_hmt.push(['_trackEvent', '在(' + site + ')取消分享给朋友', '取消分享给朋友', wx_map[wxid], 0]);
						_hmt.push(['_trackEvent', site, '取消分享给朋友', wx_map[wxid], 0]);
					}
				});
			} else {
				alert(that.msgAlertTips);
			}
		}
	}

	widget.weixin = weixin;
})(jQuery, document);

/**
 * 现在回看之前写的代码，感觉像屎一样烂。稍稍调整后，还是一样烂！
 * 其实这个widget.weiin还是有很多可以优化的，比如：
 * 可以不直接在各自方法里判断是否在微信的webview，直接在最外层判断好来，这样的话，就不用每次都重复相同的代码了；
 * 在每次调用WeixinJSBridge.invoke后的callback可以写成一个单独的方法，这样就不用重复相同的信息，并可以统一管理；
 */

