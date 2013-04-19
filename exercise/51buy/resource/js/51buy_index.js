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
			return data;
		},

		/**
		 * 填充数据
		 * 优先填充标题，让用户能先看到导航的基本内容
		 * @return {[type]} [description]
		 */
		fill : function(opts){
			var opts = opts || {};
			var wrap = opts.wrap || '#J_category_menu';

			var data = category.get();
			var tmpl = '';
			for(var i = 0; i < data.length; i++){
				var type = data[i].highlight;
				var title = data[i].text;
				var url = data[i].url;
				var keyword = data[i].keyword;

				tmpl += category.template({
					type : type,
					title : title,
					url : url,
					keyword : keyword
				});
			}
			$(wrap).html(tmpl);
		},

		/**
		 * 填充分类菜单的内容
		 * @param  {[type]} opts [description]
		 * @return {[type]}      [description]
		 */
		fill_content : function(opts){
			var data = category.get();
			console.log(data[0]);
			// 先假设以第一个分类数据进行页面交互的模拟
			var sub_menu = data[1].list;
			var recommend = data[1].recommend;
			var tmpl_main = '';
			var tmpl_side = '';
			var wrap_main = $('#J_category_menu .cate_menu:first-child .J_sub_cate_menu');
			var wrap_side = $('#J_category_menu .cate_menu:first-child .J_sub_cate_recom');
			for(var l = 0; l < sub_menu.length; l++){
				var type = 'list';
				var title = sub_menu[l].text;
				var keyword = sub_menu[l].list;
				tmpl_main += category.sub_template({
					type : type,
					title : title,
					keyword : keyword
				});
			}
			wrap_main.html(tmpl_main);

			for(var r = 0; r < recommend.length; r++){
				var type = 'recommend';
				var title = recommend[r].name;
				var keyword = recommend[r].list;
				tmpl_side += category.sub_template({
					type : type,
					title : title,
					keyword : keyword
				});
			}
			wrap_side.html(tmpl_side);
		},

		/**
		 * 默认显示的分类菜单模板
		 * @param  {[type]} opts [description]
		 * @return {[type]}      [description]
		 */
		template : function(opts){
			if(!opts) return false;
			var type = opts.type;
			var title = opts.title;
			var url = opts.url;
			var keyword = opts.keyword;
			if(keyword.length){
				var keyword_list = category.template_keyword(keyword);
			}
			var tmpl;
			
			if(type){
				tmpl = [
					'<div class="cate_menu">',
						'<div class="menu_hd">',
							'<h3 class="title">',
								'<a href="' + url + '" title="' + title + '">' + title + '</a>',
							'</h3>',
							keyword_list,
							'<b class="icon_arrow"></b>',
						'</div>',
						'<div class="menu_bd">',
							'<div class="main J_sub_cate_menu"></div>',
							'<div class="side J_sub_cate_recom"></div>',
						'</div>',
					'</div>'
				].join('');
			} else {
				tmpl = [
					'<div class="cate_menu_concise">',
						'<div class="menu_hd">',
							'<h3 class="title">',
								'<a href="' + url + '" title="' + title + '">' + title + '</a>',
							'</h3>',
							'<b class="icon_arrow"></b>',
						'</div>',
						'<div class="menu_bd">',
							'<div class="main J_sub_cate_menu"></div>',
							'<div class="side J_sub_cate_recom"></div>',
						'</div>',
					'</div>'
				].join('');
			}
			return tmpl;
		},

		/**
		 * 分类菜单的关键词列表
		 * @param  {[type]} keyword [description]
		 * @return {[type]}         [description]
		 */
		template_keyword : function(keyword){
			if(!keyword) return false;
			var tmpl = '';
			var title = keyword.title;
			var url = keyword.url;
			for(var i = 0; i < keyword.length; i++){
				var title = keyword[i].text;
				var url = keyword[i].url;
				tmpl += [
					'<li><a href="' + url + '" target="_blank" title="' + title + '">' + title + '</a></li>'
				].join('');
			}
			tmpl = '<ul class="list">' + tmpl + '</ul>'
			return tmpl;
		},

		sub_template : function(opts){
			if(!opts) return false;
			var type = opts.type;
			var title = opts.title;
			var keyword = opts.keyword;
			var keyword_list = category.sub_template_keyword(keyword);
			var tmpl;
			if(type == 'list'){
				tmpl = [
					'<div class="sub_cate_mod">',
						'<h4 class="sub_title">' + title + '</h4>',
						keyword_list,
					'</div>'
				].join('');
			} else if(type == 'recommend'){
				tmpl = [
					'<div class="sub_recom_mod">',
						'<h4 class="sub_title">' + title + '</h4>',
						keyword_list,
					'</div>'
				].join('');
			}
			return tmpl;
		},

		sub_template_keyword : function(keyword){
			if(!keyword) return false;
			var tmpl = '';
			var title = keyword.title;
			var url = keyword.url;
			for(var i = 0; i < keyword.length; i++){
				var title = keyword[i].text;
				var url = keyword[i].url;
				tmpl += [
					'<li><a href="' + url + '" target="_blank" title="' + title + '">' + title + '</a></li>'
				].join('');
			}
			tmpl = '<ul class="sub_list">' + tmpl + '</ul>'
			return tmpl;
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
	YX.category.fill({
		wrap : '#J_category_menu'
	});
	YX.category.fill_content();

	$('#J_category_menu .cate_menu:first-child .menu_bd').show()
});