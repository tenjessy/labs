/**
 * date:2012-12-20（世界末日的前一天开始编码）
 * explanation:主站一些通用的工具、函数
 */


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

/**
 * explanation:全局变量
 */
var GLOBAL = {
	/**
	 * 免邮价格
	 * @type {Number}
	 */
	free_shipping_price : 99,


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
})();

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
	avatar : function(opts){
		
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
		var sn = opts.sn;
		var reuse = opts.reuse || 0;
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

			// 错误信息
			var error = response && response.error;
			if(error){
				alert(error);
			}
			
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

		}
	}
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////
// 实例化
/////////////////////////////////////////////////////////////////////////////////////////////////////////

$(function(){
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

	/**
	 * 个人资料
	 */
	$('.main_area').live('click', function(){
		user.mini();
	});
});