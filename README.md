### 这里是自己完善代码的地方，任何观点及看法仅代表个人立场

##### mall_global.js

```
核心脚本，包括一些常用的小工具、UI插件、全局命名空间等等；
默认情况下，该文件不应该被经常更新；
如果要更新，就必须遵循一个原则（某个函数或者方法需要在全站超过3个地方被用到）；
跟UI界面相关的JS，尽量写成jQuery插件的形式；
跟业务逻辑相关的JS，尽量在同一个命名空间当中，尽量统一编码风格；
```

##### mall_shop.js

```
商场的购物车脚本，包含加入购物车、删除商品等一系列脚本功能；基本构思如下：
// 获取指定的URL
var url = GLOBAL.url.flow;

// 获取需要异步的一些参数，比如是商品类型、是否活动商品、商品ID等一系列的参数
// goods_type : 商品类型，有普通、组合、抽奖、兑换等商品类型
// goods_id : 商品ID
// quantity : 购买数量（默认为1）
// maximum_quantity : 最大购买数量；（默认为50）
// is_activity : 是否为活动商品；（默认为0，即不是活动商品）
var data = {
	goods_id : goods_id,
	goods_type : goods_type,
	quantity : quantity
	is_activity : is_activity
}

// 异步请求加入购物车
MALL.ajax({
	type : 'POST',
	url : url,
	data : data,
	sendBefore : sendBefore,
	success : success
});

// 异步请求发送前的callback，比如可以设置按钮的文字显示效果或者禁止重复提交
function sendBefore(){
	console.log('正在请求...');
}

// 异步请求成功后的callback,比如可以设置加入购物车后的提示浮层
function success(){
	console.log('请求成功，已正确返回...');
}
```

##### mall_cart.js

```
主要处理的功能包括：读取购物车里面的相关商品、删除商品、修改购买数量等逻辑。同时有些功能比较复杂，必要时应该联合后台开发的同学一起联调！
```

* 读取购物车商品的所有数据

```
// 一般来说，在购物车当中读取商品信息，要么全部是异步加载过来，要么在后台模板直接输出；
// 在这里，仅说说异步加载的情况

// 异步发送请求加载购物车数据
var data
MALL.ajax({
	type : 'GET',
	url : MALL.url.flow,
	data : data,
	sendBefore : senBefore,
	success : success
});
```