export default {
  pages: [
    'pages/index/index',
    'pages/ucenter/index/index',
    'pages/catalog/catalog',
    'pages/cart/cart',
    'pages/custom/page/page',

    'pages/ucenter/address/address',
    'pages/ucenter/addressAdd/addressAdd',
    'pages/auth/login/login',
    'pages/checkout/checkout',

    'pages/auth/accountLogin/accountLogin',
    'pages/goods/goods',
    'pages/search/search',

    'pages/auth/register/register',
    'pages/ucenter/order/order',
    'pages/ucenter/orderDetail/orderDetail',
    'pages/ucenter/aftersaleList/aftersaleList',
    'pages/ucenter/couponList/couponList',
    'pages/groupon/myGroupon/myGroupon',
    'pages/ucenter/collect/collect',
    'pages/ucenter/footprint/footprint',
    'pages/ucenter/couponSelect/couponSelect',
    'pages/payResult/payResult',
    'pages/category/category',
    'pages/coupon/coupon',
    'pages/auth/reset/reset'

  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    "backgroundColor": "#fafafa",
    "borderStyle": "white",
    "selectedColor": "#AB956D",
    "color": "#666",
    "list": [{
      "pagePath": "pages/index/index",
      "iconPath": './static/images/home.png',
      "selectedIconPath": './static/images/home@selected.png',
      "text": "首页"
    },
    {
      "pagePath": "pages/catalog/catalog",
      "iconPath": './static/images/category.png',
      "selectedIconPath": './static/images/category@selected.png',
      "text": "分类"
    },
     {
      "pagePath": "pages/cart/cart",
      "iconPath": './static/images/cart.png',
      "selectedIconPath": './static/images/cart@selected.png',
      "text": "购物车"
    }, {
      "pagePath": 'pages/ucenter/index/index',
      "iconPath": './static/images/my.png',
      "selectedIconPath": './static/images/my@selected.png',
      "text": "个人"
    }
  ]
  },
  // subpackages: [{
  //   root: "packages",
  //   name: "pack2",
  //   pages: [
  //     'pages/demo/index'
  //   ],
  // }],
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  },
  "debug": true,
}
