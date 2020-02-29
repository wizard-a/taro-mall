import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import 'taro-ui/dist/style/index.scss';
import dva from './dva';
import models from './models';
import * as user from './utils/user';
import {set as setGlobalData, get as getGlobalData} from './global_data';

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
      'pages/ucenter/index/index',
      'pages/auth/login/login',
      'pages/index/index',
      'pages/auth/accountLogin/accountLogin',
      'pages/goods/goods',
      'pages/search/search',
      'pages/catalog/catalog',
      'pages/cart/cart',

      'pages/auth/register/register'

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
        "pagePath": 'pages/ucenter/index/index',
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
    }],
    "networkTimeout": {
      "request": 10000,
      "downloadFile": 10000
    },
    "debug": true,
  }

  componentWillMount() {
    const updateManager = Taro.getUpdateManager();
    Taro.getUpdateManager().onUpdateReady(function() {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  }

  componentDidShow () {
    user.checkLogin().then(res => {
      setGlobalData('hasLogin', true);
    }).catch(() => {
      setGlobalData('hasLogin', false);
    });
  }

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
