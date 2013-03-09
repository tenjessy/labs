> 因为目前就职于一家创业公司做电商的前端重构，主要包括HTML、CSS、JS的编写及优化工作。
  所以，在这里是重构代码、思考代码的地方（当然，在不涉及商业机密和版权的情况下，我会尽量公开源码）


#####mall_global.js
	* 商城的核心样式，包括一些常用的小工具、UI插件、全局命名空间等等；
	* 默认情况下，该文件不应该被经常更新；
	* 如果要更新，就必须遵循一个原则（某个函数或者方法需要在全站超过3个地方被用到）；
	* 跟UI界面相关的JS，尽量写成jQuery插件的形式；
	* 跟业务逻辑相关的JS，尽量在同一个命名空间当中，尽量统一编码风格；

