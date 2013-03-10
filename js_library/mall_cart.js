;;;(function(){
	if(!window.MALL){
		window['MALL'] = {}
	}

	/**
	 * 购物车，功能包括：
	 * 1.将商品加入到购物车
	 * 2.从购物车移除某商品
	 * 3.修改某商品的购买数量
	 * 4.各种积分、包邮、礼包提示
	 *
	 * 所有操作，均由后台返回json
	 * 前台拿到json后，根据数据，做输出处理
	 * @type {Object}
	 */
	var shopping = {
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
			
		},

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
		tmpl : function(opts){

		}
	}
	
})();


/********************************************************************************
 * 常用的jQuery插件
 * @return {[type]} [description]
 ********************************************************************************/
;;;(function($, document){
	
})(jQuery, document);