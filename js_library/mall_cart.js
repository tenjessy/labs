/**
 * date:2013-03-16;
 * explanation:购物，仅支持加入购物车这个功能;
 */
define(function(require,exports,module){
	;;;(function(){
		if(!window.MALL){
			window['MALL'] = {}
		}

		/**
		 * 购物车，功能包括：
		 * 1.将商品加入到购物车
		 * 
		 * 一般情况下，加入购物车的功能全站都可能存在的
		 * 而在购物车的其它功能，比如删除、更新这些功能，却只有在购物车页面当中存在
		 *
		 * 所有操作，均由后台返回json
		 * 前台拿到json后，根据数据，做输出处理
		 * @type {Object}
		 */
		var shopping_cart = {
			/**
			 * 将商品加入到购物车
			 *
			 * 必传的参数
			 * product_id:商品ID
			 * product_quantity:购买数量
			 * product_type:商品类型[普通商品、活动商品、积分商品]等等
			 * 
			 * 额外参数主要几点需要注意的：
			 * 该商品是否为活动商品
			 * 该商品是否为包邮商品
			 * 该商品是否为限购商品
			 * 
			 * @param  {[type]} opts [description]
			 * @return {[type]}      [description]
			 */
			buy : function(opts){
				var opts = opts || {};
				var product_id = opts.product_id;
				var product_quantity = opts.product_quantity;
				var product_type = product_type
				
			}
		}
		window['MALL']['shopping_cart'] = shopping_cart;

		var cart = {
			/**
			 * 从购物车当中移除某商品
			 * 
			 * 必传的参数
			 * product_id:商品ID
			 *
			 * 同时，需要注意一些额外参数，因为可能某个商品是活动商品
			 * 而删除活动商品，有一些附加信息跟商品也应该要被删除
			 * @param  {[type]} opts [description]
			 * @return {[type]}      [description]
			 */
			del : function(opts){

			},

			/**
			 * 修改某商品的购买数量
			 *
			 * 必传的参数
			 * product_id:商品ID
			 * product_quantity:更新当前商品的购买数量
			 * @param  {[type]} opts [description]
			 * @return {[type]}      [description]
			 */
			update : function(opts){

			},

			/**
			 * 模板
			 * 在购物车结算页面，如果在当前页进行加购其它商品的时候，需要将模板插入到购物车的商品列表当中
			 * @param  {[type]} opts [description]
			 * @return {[type]}      [description]
			 */
			template : function(opts){
				var tmpl = [

				].join('');
				return tmpl;
			}
		}
	})();


	/********************************************************************************
	 * 常用的jQuery插件
	 * @return {[type]} [description]
	 ********************************************************************************/
	;;;(function($, document){
		
	})(jQuery, document);
});