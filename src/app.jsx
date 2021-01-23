import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Taro from '@tarojs/taro'
import 'taro-ui/dist/style/index.scss';

import dva from './dva';
import models from './models';
import * as user from './utils/user';
import * as app from './utils/app';
import {set as setGlobalData, get as getGlobalData} from './global_data';

import './app.less'

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
  componentWillMount() {
    this.update();
    app.updateShopConfig();
  }

  update = () => {
    if(process.env.TARO_ENV === 'weapp') {
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
        {this.props.children}
      </Provider>
    )
  }
}

export default App
