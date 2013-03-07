/**
 * date:2012-12-20（世界末日的前一天开始编码）
 * explanation:主站的送货地址
 */


/**
 * 送货地址
 * @type {Object}
 */

;;;(function($) {  
	$.fn.region = function() {  
		var self = this;
		// 定义三个默认值
		// 省
		// 市
		// 县、区
		self.data('province', ['请选择', '请选择']);
		self.data('city', ['请选择', '请选择']);
		self.data('county', ['请选择', '请选择']);

		// 把三个空的select插入到DOM当中
		self.append('<select class="province"></select>');
		self.append('<select class="city"></select>');
		self.append('<select class="county"></select>');

		//分别获取3个下拉框
		var $province = self.find('select[class=province]');
		var $city = self.find('select[class=city]');
		var $county = self.find('select[class=county]');

		//默认省级下拉
		if(self.data('province')){
			$province.append('<option value="' + self.data("province")[1] + '">' + self.data("province")[0] + '</option>');
		}

		// 为省级的select插入数据
		$.each(province , function(index, data){
			$province.append('<option value="' + data + '"">' + data + '</option>');
		});

		//省级联动控制
		var index;
		$province.change(function(){
			var _this = $(this);
			//清空其它2个下拉框
			// $city[0].options.length = 0;
			// $county[0].options.length = 0;
			$city.empty();
			$county.empty();

			index = this.selectedIndex;
			$('.province_name').text(_this.val());

			if(index == 0){
				if(self.data('city')){
					$city.append('<option value="' + self.data("city")[1] + '">' + self.data("city")[0] + '</option>');
				}
				if(self.data('county')){
					$county.append('<option value="' + self.data("county")[1] + '">' + self.data("county")[0] + '</option>');
				}
			} else {
				$.each(city[index-1] , function(index, data){
					$city.append("<option value='" + data + "'>" + data + "</option>");
				});
				$.each(county[index-1][0] , function(index, data){
					$county.append("<option value='" + data + "'>" + data + "</option>");
				});
			}
		}).change();

		// 市级联动控制
		var city_index;
		$city.change(function(){
			var _this = $(this);
			// 清空省、区的下拉框
			$county.empty();

			city_index = this.selectedIndex;
			$('.city_name').text(_this.val());
			$.each(county[index - 1][city_index], function(index, data){
				$county.append("<option value='" + data + "'>" + data + "</option>");
			});
		});

		var county_index;
		$county.change(function(){
			var _this = $(this);
			$('.county_name').text(_this.val());
		});

		return self;
	};
})(jQuery);


