import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import dva from './dva';
import models from './models';

import Index from './pages/index'

// import configStore from './store'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

// const store = configStore()

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
  onError(e, dispatch) {
    console.log('系统出错了!');
    // dispatch(action("sys/error", e));
  },
});
const store = dvaApp.getStore();

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/catalog/catalog',
      'pages/cart/cart',
      'pages/user/user',
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
        "text": "首页1"
      }, {
        "pagePath": "pages/catalog/catalog",
        "iconPath": './static/images/category.png',
        "selectedIconPath": './static/images/category@selected.png',
        "text": "分类"
      }, {
        "pagePath": "pages/cart/cart",
        "iconPath": './static/images/cart.png',
        "selectedIconPath": './static/images/cart@selected.png',
        "text": "购物车"
      }, {
        "pagePath": 'pages/user/user',
        "iconPath": './static/images/my.png',
        "selectedIconPath": './static/images/my@selected.png',
        "text": "个人"
      }]
    },
    subpackages: [{
      root: "packages",
      name: "pack2",
      pages: [
        'pages/demo/index'
      ],
    }]
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
