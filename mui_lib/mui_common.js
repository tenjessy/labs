/**
 * date:2012-12-20（世界末日的前一天开始编码）
 * explanation:主站一些通用的工具、函数
 */

/**
 * explanation:全局变量
 */
var free_shipping_price = 99;


/**
 * 购物车的增、删、改、查
 * @type {Object}
 */
var shoppingCart = {
	create : function(options, event){
		if(options == undefined) return false;
		var data = options.data;
		var site = options.site;

		// 计算当前商品的价格，以便判断是否包邮
		// 方便在后面显示包邮信息和需要加购多少钱才能包邮
		var shipping_fee = parseInt(data.total.shipping_fee);				// 当前运费
		var total_price = parseFloat(data.total.goods_amount);				// 当前购买商品的总费用
		var difference_price = (total_price - free_shipping_price).toFixed(2);	// 差价（用于再加购多少钱就可以包邮）
		var not_shipping_tips = '您的订单未满99元，再加购<b class="icon_rmb">&yen;</b><strong class="price">' + Math.abs( difference_price ) + '</strong>即可享受包邮服务！';
		var shipping_tips = '你的订单已享受包邮服务！';


		// 判断当前是否有商品
		var goods_length = data.goods_list.length;

		

		if(site){
			createMiniCart();
		} else {
			createSiteCart();
		}

		// 迷你购物车
		function createMiniCart(){
			// 判断当前是否包邮，并给出相应的信息
			// 通过后台算出的商品列表的长度及运费来判断
			if(goods_length > 0 && shipping_fee != 0){
				
			}
			else {

			}

			// 判断当前是否有商品，并给出相应的信息
			// 通过后台算出来的商品列表的长度
			if(goods_length  != 0){
				
			}
			else {

			}
		}

		// 购物车页面
		function createSiteCart(){
			// 判断当前是否包邮，并给出相应的信息
			// 通过后台算出的商品列表的长度及运费来判断
			if(goods_length > 0 && shipping_fee != 0){
				
			}
			else {

			}

			// 判断当前是否有商品，并给出相应的信息
			// 通过后台算出来的商品列表的长度
			if(goods_length  != 0){
				
			}
			else {

			}
		}
		
	},

	// 检索数据
	// 需要指定options对象的site参数。这个参数是指定当前在函数是在全局执行还是小范围执行
	// 因为目前网站当中，有全站的迷你购物车和一整个购物车页面
	retrieval : function(options, event){
		options = options || {};
		site = options.site;
		var url = '/flow.php';
		var t = new Date().getTime();
		var data = {
			step : 'get_cart_goods',
			t : t
		}
		
		var before = function(XMLHttpRequest){

		}
		var complete = function(XMLHttpRequest, textStatus){
			
		}
		var success = function(data, textStatus, jqXHR){
			data = $.parseJSON(data);

			var _options = {
				site : site,
				data : data
			}
			shoppingCart.create(_options);
		}
		$.ajax({
			type : 'POST',
			url : url,
			data : data,
			beforeSend : before,
			complete : complete,
			success : success
		});
	},
	update : function(options, event){

	},
	delete : function(options, event){

	}
}

/**
 * 送货地址
 * @type {Object}
 */
var deliveryAddress = {
	create : function(options) {

	},
	retrieval : function(options) {

	},
	update : function(options){

	},
	delete : function(options){

	}
}

/**
 * 获取时间
 * @type {Object}
 */
var time = {
	/**
	 * 返回当前日期
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	get : function(options){
		options = options || {},
		days = options.days;
		end_time = options.end_time;
	}
}