/**
 * explanation:51buy首页分类导航
 */
;;;(function(){
	/**
	 * 命名空间
	 * 取《易迅》的拼音首字母
	 */
	if(!window.YX) {
		window.YX = {}
	}
	/**
	 * 分类导航
	 *
	 * 如何做得更快的速度显示分类导航，并响应用户的鼠标操作，这里仅列出我自己的思路
	 *
	 * 一般来说，同步输出数据会比异步加载会更快一些，所以分类导航的默认显示部分可以通过后台模板同步输出；
	 * 而需要通过鼠标操作才显示的菜单部分，可在加载完页面文档后，再异步加载该json数据；
	 * 同时，当鼠标移入某个分类导航的时候，再通过js进行拼接模板，进而显示相应的菜单；
	 * 
	 * 但目前并不是这样的，所以！！！
	 * 假设我们已经把分类导航的json数据经过异步加载回来了；
	 * 现在做的是将数据拆分并拼接到相应的模板模板当中显示；
	 *
	 * 优先拼接的模板是分类导航默认显示的部门
	 * 然后在鼠标移入某个分类导航的时候，再通过js进行拼接子模板，进而显示相应的菜单；
	 * @type {Object}
	 */
	var category = {
		/**
		 * 获取分类导航的数据
		 * @return {[type]} [description]
		 */
		get : function(){
			var data = window.CATEGORY_CONFIG;
			console.log(data);
		},

		/**
		 * 填充数据
		 * 优先填充标题，让用户能先看到导航的基本内容
		 * @return {[type]} [description]
		 */
		fill : function(){

		}
	}
	window.YX.category = category;
})();

/**
 * 实例化
 * @param  {[type]} ){} [description]
 * @return {[type]}       [description]
 */
$(function(){
	YX.category.get();
});