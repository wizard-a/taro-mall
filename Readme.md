小程序
------------
Taro_Mall是一款多端开源在线商城应用程序，后台是基于litemall基础上进行开发，前端采用Taro框架编写，现已全部完成小程序和h5移动端，后续会对APP，淘宝，头条，百度小程序进行适配。Taro_Mall已经完成了 litemall 前端的所有功能


扫码体验
------------

> 由于小程序没有认证，只发布了一个预览版，只能加15个人，如有需要，请点击小程序申请

小程序

<img src='./public/xiaochengxu.jpg' width='150' height='150' style="margin-right: 50px"/>

h5

<img src='./public/mobile.png' width='150' height='150'/>


后台系统地址

https://shop.xinmeitop.com/boss

快速启动
------------

#### 小程序
* `git clone https://github.com/jiechud/taro-mall.git`
* `npm install || yarn install`
* `yarn dev:weapp` 启动服务
*  用微信开发者工具打开

#### h5
* `yarn dev:h5` 启动服务
* 打开浏览器

系列文章
--------
* [01 Taro_Mall 开源多端小程序框架设计](https://www.cnblogs.com/qiaojie/p/12431670.html)

功能
------------
* 首页
* 专题列表、专题详情
* 分类列表、分类详情
* 品牌列表、品牌详情
* 新品首发、人气推荐
* 优惠券列表、优惠券选择
* 商品搜索
* 商品详情
* 购物车
* 购物下单
* 订单列表、订单详情
* 地址、收藏、足迹、意见反馈


项目截图
------------------
<img src='./public/images/1-1.jpeg' width='320px' height='568px' style="margin-right: 15px"><img src='./public/images/1-2.jpeg' width='320px' height='568px' style='margin-left: 10px'><br> 

<img src='./public/images/2-1.jpeg' width='320px' height='568px' style="margin-right: 15px"><img src='./public/images/2-2.jpeg' width='320px' height='568px' style='margin-left: 10px'><br> 

<img src='./public/images/3-1.jpeg' width='320px' height='568px' style="margin-right: 15px"><img src='./public/images/3-2.jpeg' width='320px' height='568px' style='margin-left: 10px'><br> 


项目架构
------------
项目用Taro做跨端开发框架，Taro基本采用React的写法，项目集成了 redux dva 控制单向数据流，用immer来提供不可变数据，提升整体的性能，减少渲染。

技术栈
|  技术   | 说明  | 官网  |
|  ----  | ----  |  ---- |
| Taro  | 多端统一开发解决方 |  https://taro.aotu.io/      |
| TaroUI  | 一套基于 Taro 框架开发的多端 UI 组件库 |  https://taro-ui.jd.com/    |
| redux| 单项数据流   | https://redux.js.org/  |
| dva |  基于 redux 和 redux-saga 的数据流方案 |  https://dvajs.com/ |
| immer | 创建不可变数据 |  https://immerjs.github.io/immer/docs/introduction |


赞赏
-----------
因服务器是由个人维护，如果这个项目对您有帮助，您可以扫描下面二维码进行捐赠，谢谢。

<img src='./public/wx-pay.png' width='150' height='150'/><img src='./public/ali-pay.png' width='150' height='150'/>

联系我
--------------
QQ：1454763497<br>

微信: <img src='./public/my.png' width='150' height='150'/>

License
------------
MIT License  Copyright (c) 2020 jiechud
