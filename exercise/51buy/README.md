# 易迅网首页

## 关于两个样式文件
* 在开发环境下，可以分开多个样式文件进行编写。在正式环境，需要协同后台开发的同学将多个样式的url进行合并；
* 原则上，可以将样式拆分成3个的，因为需要做宽窄两种屏的效果，但目前该首页的布局模块并不复杂，且数量不多，所以将自适应的部分一同写进现在的两个样式表当中；

## 关于修饰性图片
* 按规划，应该在resource/img里面放置修饰性图片的，但现在直接采用线上的图片，故这个文件夹没有存放图片；
* 目前是直接采用51buy线上的图片，所以并没有重新切图；

## 关于宽窄两种效果
* 要兼容PC的主流浏览器的话，正确做法应该是通过js来检测屏幕的分辨率，然后在body当中绑定一个className。
* 而现在，我直接通过CSS3的media进行相应的设置，max-width:1179px;