;;;(function(){
	if(!window.Widget){
		window['Widget'] = {}
	}

	var common = {
		/**
		 * 关注微信号
		 * @return {[type]} [description]
		 */
		getAttention : function(options){
			options = options || {};
			wxid = options.wxid || wxid;

			if (typeof WeixinJSBridge !== "undefined") {
				WeixinJSBridge.invoke('addContact', {
					"webtype": "1",
					"username": wxid
				},function(res){
					if (res.err_msg.search('ok') != -1 || res.err_msg.search('confirm') != -1){
						_hmt.push(['_trackEvent', '在(' + site + ')关注微信号(' + wx_map[wxid] + ')', '关注微信号', wx_map[wxid], 1]);
						_hmt.push(['_trackEvent', site, '关注微信号', wx_map[wxid], 1]);
					} else {
						_hmt.push(['_trackEvent', '在(' + site + ')取消关注微信号(' + wx_map[wxid] + ')', '取消关注微信号', wx_map[wxid], 0]);
						_hmt.push(['_trackEvent', site, '取消关注微信号', wx_map[wxid], 0]);
					}
				});
			}else{
				alert("请在微信里访问 :)");
			};
		},

		/**
		 * 分享到微博
		 */
		setShareWeibo : function(options){
			options = options || {};
			wxid = options.wxid || wxid;

			if (typeof WeixinJSBridge !== "undefined") {

				// var current_origin = location.href.indexOf('?');
				// var share_url = location.href.substr(0, current_origin);

				var name = getEmailName();
				var addressee = name.addressee;
				var sender = name.sender;

				if(addressee == undefined || sender == undefined) return false;

				$('.addressee').text(addressee);

				var content = $.trim($('#J_share_title').text());
				var url = 'http://wx.huimf.com/p/20121221/i.html?addressee=' + encodeURIComponent(addressee) + '&sender=' + encodeURIComponent(sender);

				WeixinJSBridge.invoke('shareWeibo',{
					'content' : "#微信分享# " + content,  // 分享到微薄的内容
					'url' : url // 分享连接地址
				},function(res){
					if (res.err_msg.search('ok') != -1 || res.err_msg.search('confirm') != -1){
						_hmt.push(['_trackEvent', '在(' + site + ')分享到微博', '分享到微博', wx_map[wxid], 1]);
						_hmt.push(['_trackEvent', site, '分享到微博', wx_map[wxid], 1]);
					} else {
						_hmt.push(['_trackEvent', '在(' + site + ')取消分享到微博', '取消分享到微博', wx_map[wxid], 0]);
						_hmt.push(['_trackEvent', site, '取消分享到微博', wx_map[wxid], 0]);
					}
					WeixinJSBridge.log(res.err_msg);
				});
			} else {
				alert("请在微信里访问 :)");
			}
		},

		/**
		 * 分享到朋友圈
		 */
		setShareTimeline : function(options){
			options = options || {};
			wxid = options.wxid || wxid;

			if (typeof WeixinJSBridge !== "undefined") {

				// var current_origin = location.href.indexOf('?');
				// var share_url = location.href.substr(0, current_origin);

				var name = getEmailName();
				var addressee = name.addressee;
				var sender = name.sender;

				if(addressee == undefined || sender == undefined) return false;

				$('.addressee').text(addressee);

				var title = $.trim($('#J_share_title').text());
				var img_url = $('.article_content img').eq(0).attr('src') || $('#J_share_img').attr('src');
				// var link = share_url + '?addressee=' + addressee + '&sender=' + sender;
				var link = 'http://wx.huimf.com/p/20121221/i.html?addressee=' + encodeURIComponent(addressee) + '&sender=' + encodeURIComponent(sender);
				var desc = $.trim($('.article_content p').text()) || title;
				
				WeixinJSBridge.invoke('shareTimeline',{
					'img_url' 		: img_url,
					'link' 			: link,
					'desc' 			: desc,
					'title' 		: title
				},function(res){
					if (res.err_msg.search('ok') != -1 || res.err_msg.search('confirm') != -1){
						_hmt.push(['_trackEvent', '在(' + site + ')分享到朋友圈', '分享到朋友圈', wx_map[wxid], 1]);
						_hmt.push(['_trackEvent', site, '分享到朋友圈', wx_map[wxid], 1]);
					} else {
						_hmt.push(['_trackEvent', '在(' + site + ')取消分享到朋友圈', '取消分享到朋友圈', wx_map[wxid], 0]);
						_hmt.push(['_trackEvent', site, '取消分享到朋友圈', wx_map[wxid], 0]);
					}
					WeixinJSBridge.log(res.err_msg);
				});
			} else {
				alert("请在微信里访问 :)");
			}
		},

		/**
		 * 分享给朋友
		 * @param {[type]} options [description]
		 */
		setShareFriend : function(options){
			options = options || {};
			wxid = options.wxid || wxid;


			if (typeof WeixinJSBridge !== "undefined") {

				// var current_origin = window.location.href.indexOf('?');
				// var share_url = window.location.href.substr(0, current_origin);

				var name = getEmailName();
				var addressee = name.addressee;
				var sender = name.sender;

				if(addressee == undefined || sender == undefined) return false;

				$('.addressee').text(addressee);

				var title = $.trim($('#J_share_title').text());
				var img_url = $('.article_content img').eq(0).attr('src') || $('#J_share_img').attr('src');
				// var link = share_url + '?addressee=' + addressee + '&sender=' + sender;
				var link = 'http://wx.huimf.com/p/20121221/i.html?addressee=' + encodeURIComponent(addressee) + '&sender=' + encodeURIComponent(sender);
				var desc = $.trim($('.article_content p').text()) || title;
				
				WeixinJSBridge.invoke('sendAppMessage',{
					'img_url' 		: img_url,
					'link' 			: link,
					'desc' 			: desc,
					'title' 		: title
				},function(res){
					if (res.err_msg.search('ok') != -1 || res.err_msg.search('confirm') != -1){
						_hmt.push(['_trackEvent', '在(' + site + ')分享给朋友', '分享给朋友', wx_map[wxid], 1]);
						_hmt.push(['_trackEvent', site, '分享给朋友', wx_map[wxid], 1]);
					} else {
						_hmt.push(['_trackEvent', '在(' + site + ')取消分享给朋友', '取消分享给朋友', wx_map[wxid], 0]);
						_hmt.push(['_trackEvent', site, '取消分享给朋友', wx_map[wxid], 0]);
					}
					WeixinJSBridge.log(res.err_msg);
				});
			} else {
				alert("请在微信里访问 :)");
			}
		}
	}
})(jQuery, document);